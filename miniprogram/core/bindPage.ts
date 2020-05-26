// @ts-nocheck
import { Observer } from "./Observer";
import { logger, def, JSONClone } from "./utils";
// eslint-disable-next-line no-unused-vars
import { UpdateTaskQueue } from "./Base";
import { BaseConfigs, ProxyKeys } from "./config";
import { triggerComputed, updateData } from "./helper";

function injectData(registerObj: { data?: any }, tpl: { [x: string]: any }) {
  const data = Object.keys(tpl).reduce((pre, key) => {
    // @ts-ignore
    pre[key] = tpl[key];
    return pre;
  }, {});

  registerObj.data = data;
}

function injectOnEvents(
  registerObj: { [x: string]: any },
  tpl: { [x: string]: any }
) {
  let proto = tpl;

  while (!proto.isPrototypeOf(Object)) {
    Object.getOwnPropertyNames(proto)
      .filter((key) => {
        return key.substr(0, 2) === "on";
      })
      .forEach((key) => {
        const desc = Object.getOwnPropertyDescriptor(proto, key);

        // ! Hack, do not read getter before observer data
        if (desc && desc.get) {
          // skip getter
        } else if (typeof tpl[key] === "function") {
          registerObj[key] = proto[key];
        }
      });

    proto = Object.getPrototypeOf(proto);
  }
}

/**
 * Include computed, watch and other functions
 */
function injectFunctions(
  proxyObj: {
    target: any;
    data?: any;
    computed: any;
    watch: any;
    updateQueue?: null;
  },
  tpl: { [x: string]: { bind: (arg0: any) => any } }
) {
  let proto = tpl;
  const page = proxyObj.target;

  while (!proto.isPrototypeOf(Object)) {
    Object.getOwnPropertyNames(proto)
      .filter((key) => {
        const filterKeys = ["constructor", "onLoad"];
        return filterKeys.indexOf(key) === -1;
      })
      .forEach((key) => {
        const desc = Object.getOwnPropertyDescriptor(proto, key);

        // is computed
        // ! Hack, do not read getter before observer data
        if (desc && desc.get) {
          proxyObj.computed[key] = desc.get;
        } else if (typeof tpl[key] === "function") {
          // is watch
          if (key.startsWith("$$")) {
            proxyObj.watch[key.slice(2)] = tpl[key].bind(page);
            // function
          } else {
            page[key] = tpl[key].bind(page);
          }
        }
      });

    proto = Object.getPrototypeOf(proto);
  }
}

function observerData(proxyObj: {
  target: any;
  data: any;
  computed?: {};
  watch?: {};
  updateQueue?: null;
}) {
  const page = proxyObj.target;

  // eslint-disable-next-line no-new
  new Observer(proxyObj.data, (newData: any, oldData: any) => {
    // @ts-ignore
    updateData(proxyObj, newData, oldData);
  });

  // Proxy observed data
  Object.keys(page.data).forEach((key) => {
    Object.defineProperty(page, key, {
      get: () => {
        return proxyObj.data[key];
      },
      set: (val) => {
        proxyObj.data[key] = val;
      },
      configurable: true,
      enumerable: true,
    });
  });
}

function injectOnload(
  registerObj: { onLoad?: any },
  tpl: { onLoad: { apply: (arg0: any, arg1: any[]) => any } }
) {
  registerObj.onLoad = function (this: any, ...args: any) {
    logger("Page loaded", this);
    if (BaseConfigs.debug) {
      // @ts-ignore
      global.page = this;
    }

    const proxyObj = {
      target: this,
      data: JSONClone(this.data),
      computed: {},
      watch: {},
      updateQueue: null,
    };

    def(this, ProxyKeys.PROXY, proxyObj);

    injectFunctions(proxyObj, tpl as any);

    // @ts-ignore
    const updateQueue = new UpdateTaskQueue(this);
    // @ts-ignore
    proxyObj.updateQueue = updateQueue;

    observerData(proxyObj);

    // Trigger computed and calculate dependence
    // @ts-ignore
    triggerComputed(this);

    // onload
    tpl.onLoad && tpl.onLoad.apply(this, args);
  };
}

/**
 *
 * @param {BasePage} Base
 */
function bindPage(Base: any) {
  const tpl = Base;

  const registerObj = {};

  injectData(registerObj, tpl);
  injectOnEvents(registerObj, tpl);
  injectOnload(registerObj, tpl);

  logger("Register page", registerObj);
  // Register Page
  Page(registerObj);
}

export { bindPage };
