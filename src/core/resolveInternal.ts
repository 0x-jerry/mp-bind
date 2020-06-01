import { configs, ProxyKeys } from "./config";
import { def, JSONClone } from "./utils";
import { UpdateTaskQueue, JSONLike } from "./UpdateQueue";
import { Observer } from "./Observer";
import { logger } from "./Logger";
import { PrototypeType, Prototype, IPropTypeMap } from "./define";

export interface InternalInstance extends Page.PageInstance {
  [ProxyKeys.PROXY]: ProxyInstance;
  [ProxyKeys.OB]: Observer;
  [key: string]: any;
}

export interface ProxyInstance {
  type: PrototypeType;
  data: JSONLike;
  watch: Record<string, <T>(newVal: T, oldVal: T) => void>;
  updateTask: UpdateTaskQueue;
  triggerWatch: <T>(path: string, newVal: T, oldVal: T) => void;
  getter: Record<string, () => any>;
}

interface BindOption {
  target: Prototype;
  type: PrototypeType;
  propTypeMap: IPropTypeMap;
}

function bindWatch(internal: InternalInstance, { propTypeMap }: BindOption) {
  for (const key of propTypeMap.watcher) {
    internal[ProxyKeys.PROXY].watch[key.slice(2)] = internal[key];
  }
}

function bindGetter(internal: InternalInstance, { propTypeMap }: BindOption) {
  for (const key of Object.keys(propTypeMap.getter)) {
    Object.defineProperty(internal, key, {
      get() {
        return propTypeMap.getter[key].call(internal);
      },
    });
  }
}

function observe(internal: InternalInstance, { propTypeMap }: BindOption) {
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
function getRawData({ target }: BindOption) {
  return JSONClone(target.data);
}

function setEntryMethod(
  entry: (internal: InternalInstance) => void,
  { type, target }: BindOption
) {
  // Page
  if (type === PrototypeType.page) {
    const rawOnLoad: Function | undefined = target.onLoad;

    target.onLoad = function (this: InternalInstance, ...args: any) {
      entry(this);
      rawOnLoad?.apply(this, args);
      // 强制更新一次，确保 getter 更新
      this[ProxyKeys.PROXY].updateTask.flush();
    };
    return;
  }

  // Component
  if (configs.platform === "wx") {
    const rawCreated: Function | undefined = target.lifetimes.created;
    target.lifetimes.created = function (this: InternalInstance, ...args: any) {
      entry(this);
      rawCreated?.apply(this, args);
    };

    const rawAttached: Function | undefined = target.lifetimes.attached;
    target.lifetimes.attached = function (
      this: InternalInstance,
      ...args: any
    ) {
      // 强制更新一次，确保 getter 更新
      this[ProxyKeys.PROXY].updateTask.flush();
      rawAttached?.apply(this, args);
    };
  } else if (configs.platform === "ali") {
    // onInit 需要开启 component2: true
    // https://opendocs.alipay.com/mini/framework/custom-component-overview#%E4%BD%BF%E7%94%A8%E9%A1%BB%E7%9F%A5
    const rawOnInit: Function | undefined = target.onInit;

    target.didMount = function (this: InternalInstance, ...args: any) {
      entry(this);
      rawOnInit?.apply(this, args);
      // 强制更新一次，确保 getter 更新
      this[ProxyKeys.PROXY].updateTask.flush();
    };
  }
}

export function resolveEntry(opt: BindOption) {
  const entryFunc = function (internal: InternalInstance) {
    if (configs.debug) {
      // @ts-ignore
      configs.platformConf.page.ctor.page = internal;
    }

    logger.log(opt.type, "loaded", internal);
    // 注意 this !== target
    const proxy: ProxyInstance = {
      type: opt.type,
      data: internal.data,
      getter: opt.propTypeMap.getter,
      watch: {},
      updateTask: new UpdateTaskQueue(internal),
      triggerWatch(path, newVal, oldVal) {
        const func = proxy.watch[path];
        if (func) {
          func(newVal, oldVal);
        }
      },
    };

    def(internal, ProxyKeys.PROXY, proxy);
    def(internal, ProxyKeys.DATA, getRawData(opt));

    bindWatch(internal, opt);
    observe(internal, opt);

    bindGetter(internal, opt);
  };

  setEntryMethod(entryFunc, opt);
}
