import { JSONLike } from "./UpdateQueue";
import { isFunction, isFrozen, isObject, cached } from "./utils";
import { resolveEntry } from "./resolveInternal";
import { Base } from "./Base";
import { configs } from "./config";
import { logger } from "./Logger";

export interface RawPrototype extends Base {
  [key: string]: any;
}

export interface Prototype extends Page.PageInstance {
  [key: string]: any;
}

export enum PrototypeType {
  page = "page",
  component = "component",
}

export interface IPropTypeMap {
  data: string[];
  /**
   * 包括 life cycle 和普通函数
   */
  method: string[];
  getter: Record<string, () => any>;
  watcher: string[];
  unobserve: string[];
}

interface PrototypeConfig {
  type: PrototypeType;
  tpl: RawPrototype;
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
      return cDesc.get;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

const isWatcherKey = cached((key: string) => {
  const rule = configs.watcherKeyRule;
  return rule.test(key);
});

function getPropType(obj: any, prop: string): keyof IPropTypeMap {
  // @ts-ignore
  const value = obj[prop];

  if (isFunction(value)) {
    if (isWatcherKey(value)) {
      return "watcher";
    }

    return "method";
  }

  if (isObject(value) && isFrozen(value)) {
    return "unobserve";
  }

  return "data";
}

/**
 * 分析 tpl 中的 key 对应的类型, 并分类
 *
 */
function getPropTypeMap(tpl: RawPrototype, tplType: PrototypeType) {
  const excludeKeys = ["constructor"];

  const protoTypeMap: IPropTypeMap = {
    data: [],
    unobserve: [],
    method: [],
    getter: {},
    watcher: [],
  };

  let proto = tpl;

  while (!proto.isPrototypeOf(Object)) {
    const names = Object.getOwnPropertyNames(proto);

    const platformConf = configs.platformConf[tplType];

    for (const key of names) {
      if (platformConf.reserveKeys.indexOf(key) >= 0) {
        logger.warn("Please do not set reserve key:", key);
        continue;
      }

      if (excludeKeys.indexOf(key) >= 0) {
        continue;
      }

      const getter = isGetter(tpl, key);

      if (getter) {
        protoTypeMap["getter"][key] = getter;
      } else {
        const type = getPropType(tpl, key);
        protoTypeMap[type].push(key);
      }
    }

    proto = Object.getPrototypeOf(proto);
  }

  return protoTypeMap;
}

function bindData(target: Prototype, { tpl, propTypeMap }: PrototypeConfig) {
  const data: JSONLike = {};
  for (const key of propTypeMap.data) {
    data[key] = tpl[key];
  }

  target.data = data;
}

function bindMethod(target: Prototype, { tpl, propTypeMap }: PrototypeConfig) {
  for (const key of propTypeMap.method) {
    target[key] = tpl[key];
  }
}

function bindUnobserve(
  target: Prototype,
  { tpl, propTypeMap }: PrototypeConfig
) {
  for (const key of propTypeMap.unobserve) {
    target[key] = tpl[key];
  }
}

export function bind(
  tpl: RawPrototype,
  type: PrototypeType = PrototypeType.page
) {
  const target: Prototype = {};

  const propTypeMap: IPropTypeMap = getPropTypeMap(tpl, type);

  const opt: PrototypeConfig = {
    type,
    tpl,
    propTypeMap,
  };

  bindData(target, opt);
  bindUnobserve(target, opt);
  bindMethod(target, opt);

  resolveEntry({ target, type, propTypeMap });

  if (type === "page") {
    configs.platformConf.page.ctor(target);
  } else {
    configs.platformConf.component.ctor(target);
  }
}
