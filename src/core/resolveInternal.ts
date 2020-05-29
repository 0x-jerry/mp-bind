import { BindPrototype, PrototypeConfig } from "./bind";
import { configs, ProxyKeys } from "./config";
import { def } from "./utils";
import { UpdateTaskQueue, JSONLike } from "./UpdateQueue";
import { Observer } from "./Observer";
// import { Watcher } from "./Watcher";

export interface InternalInstance extends Page.PageInstance {
  [ProxyKeys.PROXY]: ProxyInstance;
  [ProxyKeys.OB]: Observer;
  [key: string]: any;
}

export interface ProxyInstance extends PrototypeConfig {
  target: Page.PageInstance;
  data: JSONLike;
  watch: Record<string, <T>(newVal: T, oldVal: T) => void>;
  updateTask: UpdateTaskQueue;
  triggerWatch: <T>(path: string, newVal: T, oldVal: T) => void;
}

function bindFunction(
  internal: InternalInstance,
  { tpl, propTypeMap }: PrototypeConfig
) {
  for (const key of propTypeMap.method) {
    internal[key] = tpl[key];
  }
}

function bindWatch(
  internal: InternalInstance,
  { tpl, propTypeMap }: PrototypeConfig
) {
  for (const key of propTypeMap.watch) {
    internal[ProxyKeys.PROXY].watch[key.slice(2)] = tpl[key];
  }
}

function bindUnobserveData(
  internal: InternalInstance,
  { tpl }: PrototypeConfig
) {
  configs.unobserveKeys.forEach((key) => (internal[key] = tpl[key]));
}

function bindGetter(
  internal: InternalInstance,
  { propTypeMap }: PrototypeConfig
) {
  for (const key of Object.keys(propTypeMap.getter)) {
    Object.defineProperty(internal, key, {
      get() {
        return propTypeMap.getter[key].call(internal);
      },
    });
  }
  internal[ProxyKeys.PROXY].updateTask.flush();
}

function observe(internal: InternalInstance, { propTypeMap }: PrototypeConfig) {
  for (const key of propTypeMap.data) {
    Object.defineProperty(internal, key, {
      get() {
        return internal[ProxyKeys.DATA][key];
      },
      set(value) {
        internal[ProxyKeys.DATA][key] = value;
      },
    });
  }

  new Observer(internal[ProxyKeys.DATA], {
    update: (opt) => {
      const { path, value, oldValue } = opt;
      internal[ProxyKeys.PROXY].triggerWatch(path, value, oldValue);

      internal[ProxyKeys.PROXY].updateTask.push(opt);
    },
  });
}

/**
 * 从 tpl 获取原始数据，以保证 frozen 逻辑正常
 */
function getRawData({ tpl, propTypeMap }: PrototypeConfig) {
  const data: any = {};
  for (const key of propTypeMap.data) {
    data[key] = tpl[key];
  }

  return data;
}

export function resolveOnload(target: BindPrototype, opt: PrototypeConfig) {
  const initKey = opt.type === "page" ? "onLoad" : "onInit";

  target[initKey] = function (this: InternalInstance, ...args: any) {
    if (configs.debug) {
      // @ts-ignore
      configs.platformConf.page.ctor.page = this;
    }

    // 注意 this !== target
    const internal: ProxyInstance = {
      ...opt,
      target: this,
      data: this.data,
      watch: {},
      updateTask: new UpdateTaskQueue(this),
      triggerWatch(path, newVal, oldVal) {
        const func = internal.watch[path];
        if (func) {
          func(newVal, oldVal);
        }
      },
    };

    def(this, ProxyKeys.PROXY, internal);
    def(this, ProxyKeys.DATA, getRawData(opt));

    bindFunction(this, opt);
    bindWatch(this, opt);
    bindUnobserveData(this, opt);
    observe(this, opt);
    bindGetter(this, opt);

    const { tpl } = opt;

    tpl[initKey]?.apply(this, args);
  };
}
