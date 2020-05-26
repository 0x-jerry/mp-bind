import { UpdateTaskQueue, JSONLike } from "./UpdateQueue";
import { isFunction, def } from "./utils";
import { ProxyKeys } from "./config";
import { ComputedValue } from "./Computed";

export interface ProxyInstance<T = any, K = any> {
  target: Page.PageInstance<T, K>;
  data: JSONLike;
  computed: Record<string, ComputedValue>;
  watch: Record<string, any>;
  updateTask: UpdateTaskQueue;
}

export interface InternalInstance extends Page.PageInstance {
  [ProxyKeys.PROXY]: ProxyInstance;
  [key: string]: any;
}

export interface Prototype {
  [key: string]: any;
}

export interface BindPrototype extends Page.PageInstance {
  [key: string]: any;
}

interface IPropTypeMap {
  data: string[];
  function: string[];
  getter: string[];
}

export interface PrototypeConfig {
  tpl: Prototype;
  propTypeMap: IPropTypeMap;
}

const getPropType = (obj: Object, name: string): keyof IPropTypeMap => {
  const desc = Object.getOwnPropertyDescriptor(obj, name);
  if (desc && desc.get) {
    return "getter";
  }

  // @ts-ignore
  const value = obj[name];

  if (isFunction(value)) {
    return "function";
  }

  return "data";
};

/**
 * 分析 tpl 中的 key 对应的类型, 并分类
 *
 * exclude keys: constructor
 *
 */
function getPropTypeMap(tpl: Prototype) {
  const excludeKeys = config.excludeBindKeys;

  const protoTypeMap: IPropTypeMap = {
    data: [],
    function: [],
    getter: [],
  };

  let proto = tpl;

  while (!proto.isPrototypeOf(Object)) {
    const names = Object.getOwnPropertyNames(proto);
    for (const key of names) {
      if (excludeKeys.indexOf(key) >= 0) {
        continue;
      }

      const type = getPropType(tpl, key);
      protoTypeMap[type].push(key);
    }

    proto = Object.getPrototypeOf(proto);
  }

  return protoTypeMap;
}

function bindData(
  target: BindPrototype,
  { tpl, propTypeMap }: PrototypeConfig
) {
  const data: JSONLike = {};
  for (const key of propTypeMap.data) {
    data[key] = tpl[key];
  }

  target.data = data;
}

function bindFunction(
  target: BindPrototype,
  { tpl, propTypeMap }: PrototypeConfig
) {
  for (const key of propTypeMap.function) {
    // @ts-ignore
    target[key] = (tpl[key] as Function).bind(target);
  }
}

function resolveOnload(target: BindPrototype, { tpl }: PrototypeConfig) {
  target.onLoad = function (this: InternalInstance, ...args) {
    // 注意 this !== target
    const internal: ProxyInstance = {
      target: this,
      data: this.data,
      computed: {},
      watch: {},
      updateTask: new UpdateTaskQueue(this),
    };

    def(target, ProxyKeys.PROXY, internal);

    tpl.onLoad?.apply(this, args);
  };
}

const config = {
  excludeBindKeys: ["constructor"],
};

export function bind(tpl: Prototype, type: "page" | "component" = "page") {
  const target: BindPrototype = {};
  const propTypeMap: IPropTypeMap = getPropTypeMap(tpl);

  const opt: PrototypeConfig = {
    tpl,
    propTypeMap,
  };

  bindData(target, opt);
  bindFunction(target, opt);
  resolveOnload(target, opt);

  if (type === "page") {
    Page(target);
  } else {
    // @ts-ignore
    Component(target);
  }
}
