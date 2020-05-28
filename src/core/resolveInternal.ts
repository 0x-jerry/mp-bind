import { BindPrototype, PrototypeConfig } from "./bind";
import { BaseConfigs, ProxyKeys } from "./config";
import { def } from "./utils";
import { UpdateTaskQueue, JSONLike } from "./UpdateQueue";
import { Observer } from "./Observer";
// import { Watcher } from "./Watcher";

export interface InternalInstance extends Page.PageInstance {
  [ProxyKeys.PROXY]: ProxyInstance;
  [ProxyKeys.OB]: Observer;
  [key: string]: any;
}

export interface ProxyInstance<T = any, K = any> extends PrototypeConfig {
  target: Page.PageInstance<T, K>;
  data: JSONLike;
  // getter: Record<string, Watcher>;
  watch: Record<string, <T>(newVal: T, oldVal: T) => void>;
  updateTask: UpdateTaskQueue;
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

function emitWatch<T = any>(
  instance: InternalInstance,
  path: string,
  newVal: T,
  oldVal: T
) {
  const func = instance[ProxyKeys.PROXY].watch[path];
  if (func) {
    func(newVal, oldVal);
  }
}

function observe(target: InternalInstance, { propTypeMap }: PrototypeConfig) {
  for (const key of propTypeMap.data) {
    Object.defineProperty(target, key, {
      get() {
        return target[ProxyKeys.DATA][key];
      },
      set(value) {
        target[ProxyKeys.DATA][key] = value;
      },
    });
  }

  new Observer(target[ProxyKeys.DATA], {
    update: (path, newVal, oldVal) => {
      emitWatch(target, path, newVal, oldVal);

      target[ProxyKeys.PROXY].updateTask.push({
        mode: "data",
        value: newVal as any,
        path: path,
      });
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
    if (BaseConfigs.debug) {
      // @ts-ignore
      Page.page = this;
    }

    // 注意 this !== target
    const internal: ProxyInstance = {
      ...opt,
      target: this,
      data: this.data,
      watch: {},
      updateTask: new UpdateTaskQueue(this),
    };

    def(this, ProxyKeys.PROXY, internal);
    def(this, ProxyKeys.DATA, getRawData(opt));

    bindFunction(this, opt);
    bindWatch(this, opt);
    observe(this, opt);
    bindGetter(this, opt);

    const { tpl } = opt;

    tpl[initKey]?.apply(this, args);
  };
}
