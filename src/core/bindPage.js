import { Observer } from './Observer';
import { logger, def, JSONClone } from './utils';
import { BasePage, UpdateTaskQueue } from './Base';
import { BaseConfigs } from './config';
import { triggerComputed, updateData } from './helper';

function injectData(registerObj, tpl) {
  const data = Object.keys(tpl).reduce((pre, key) => {
    pre[key] = tpl[key];
    return pre;
  }, {});

  registerObj.data = data;
}

/**
 * Include computed, watch and other functions
 */
function injectFunctions(proxyObj, tpl) {
  let proto = tpl;
  const page = proxyObj.target;

  while (!proto.isPrototypeOf(Object)) {
    Object.getOwnPropertyNames(proto)
      .filter((key) => {
        const filterKeys = ['constructor', 'onLoad'];
        return filterKeys.indexOf(key) === -1;
      })
      .forEach((key) => {
        const desc = Object.getOwnPropertyDescriptor(proto, key);

        // is computed
        // ! Hack, do not read getter before observer data
        if (desc && desc.get) {
          proxyObj.computed[key] = desc.get;
        } else if (typeof tpl[key] === 'function') {
          // is watch
          if ((key).startsWith('$$')) {
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

function observerData(proxyObj) {
  const page = proxyObj.target;

  new Observer(proxyObj.data, (newData, oldData) => {
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

function injectOnload(registerObj, tpl) {
  registerObj.onLoad = function(...args) {
    logger('Page loaded', this);
    if (BaseConfigs.debug) {
      global.page = this;
    }

    const proxyObj = {
      target: this,
      data: JSONClone(this.data),
      computed: {},
      watch: {},
      updateQueue: null,
    };

    def(this, BaseConfigs.PROXY_KEY, proxyObj);

    injectFunctions(proxyObj, tpl);

    // @ts-ignore
    const updateQueue = new UpdateTaskQueue(this);
    proxyObj.updateQueue = updateQueue;

    observerData(proxyObj);

    // Trigger computed and calculate dependence
    // @ts-ignore
    triggerComputed(this);

    // onload
    tpl.onLoad && tpl.onLoad.call(this, args);
  };
}

/**
 *
 * @param {BasePage} Base
 */
function bindPage(Base) {
  const tpl = new Base();

  const registerObj = {};

  injectData(registerObj, tpl);
  injectOnload(registerObj, tpl);

  logger('Register page', registerObj);
  // Register Page
  Page(registerObj);
}

export { bindPage };
