import { BindPrototype, PrototypeConfig } from "./bind";
import { BaseConfigs, ProxyKeys } from "./config";
import { logger, def } from "./utils";
import { UpdateTaskQueue, JSONLike } from "./UpdateQueue";
import { ComputedValue } from "./Computed";

export interface InternalInstance extends Page.PageInstance {
  [ProxyKeys.PROXY]: ProxyInstance;
  [key: string]: any;
}

export interface ProxyInstance<T = any, K = any> {
  target: Page.PageInstance<T, K>;
  data: JSONLike;
  computed: Record<string, ComputedValue>;
  watch: Record<string, any>;
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

export function resolveOnload(target: BindPrototype, opt: PrototypeConfig) {
  target.onLoad = function (this: InternalInstance, ...args) {
    logger("Page loaded", this);
    if (BaseConfigs.debug) {
      // @ts-ignore
      global.page = this;
    }

    // 注意 this !== target
    const internal: ProxyInstance = {
      target: this,
      data: this.data,
      computed: {},
      watch: {},
      updateTask: new UpdateTaskQueue(this),
    };

    def(this, ProxyKeys.PROXY, internal);

    bindFunction(this, opt);

    const { tpl } = opt;

    tpl.onLoad?.apply(this, args);
  };
}
