import { JSONLike } from "./UpdateQueue";
import { isFunction } from "./utils";
import { resolveOnload } from "./resolveInternal";
import { logger } from "./Logger";

export interface Prototype {
  [key: string]: any;
}

export interface BindPrototype extends Page.PageInstance {
  [key: string]: any;
}

interface IPropTypeMap {
  data: string[];
  lifecycle: string[];
  method: string[];
  getter: string[];
  watch: string[];
}

export interface PrototypeConfig {
  type: "page" | "component";
  tpl: Prototype;
  propTypeMap: IPropTypeMap;
}

/**
 * 这里需要递归判断，因为 getter 可能在原型链上面，而不在当前实例
 */
function isGetter(obj: Object, prop: string) {
  let proto = obj;
  let cDesc = null;

  while (!proto.isPrototypeOf(Object)) {
    cDesc = Object.getOwnPropertyDescriptor(proto, prop);
    if (cDesc && cDesc.get) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

function getPropType(obj: Object, prop: string): keyof IPropTypeMap {
  if (isGetter(obj, prop)) {
    return "getter";
  }

  // @ts-ignore
  const value = obj[prop];

  if (isFunction(value)) {
    if (prop.startsWith("on")) {
      return "lifecycle";
    }

    if (prop.startsWith("$$")) {
      return "watch";
    }

    return "method";
  }

  return "data";
}

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
    method: [],
    getter: [],
    lifecycle: [],
    watch: [],
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

function bindLifeCycle(
  target: BindPrototype,
  { tpl, propTypeMap }: PrototypeConfig
) {
  for (const key of propTypeMap.lifecycle) {
    target[key] = tpl[key];
  }
}

const config = {
  excludeBindKeys: ["constructor"],
  // todo, use this prop to init lifecycle
  lifeCycles: [],
};

export function bind(tpl: Prototype, type: PrototypeConfig["type"] = "page") {
  const target: BindPrototype = {};
  const propTypeMap: IPropTypeMap = getPropTypeMap(tpl);

  const opt: PrototypeConfig = {
    type,
    tpl,
    propTypeMap,
  };

  logger("init bind option", opt);

  bindData(target, opt);
  bindLifeCycle(target, opt);
  resolveOnload(target, opt);

  if (type === "page") {
    Page(target);
  } else {
    // @ts-ignore
    Component(target);
  }
}
