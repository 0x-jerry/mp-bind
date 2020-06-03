import { JSONLike } from "./UpdateQueue";
import { isFunction, isFrozen, isObject, cached } from "./utils";
import { resolveEntry } from "./resolveInternal";
import { configs } from "./config";
import { logger } from "./Logger";
import {
  PrototypeType,
  IPropTypeMap,
  RawPrototype,
  Prototype,
  PrototypeConfig,
  IWxPageCtor,
  IWxComponentCtor,
} from "./define";

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

function isUnobserveKeys(prop: string, type: PrototypeType) {
  return configs.platformConf[type].unobserveKeys.indexOf(prop) >= 0;
}

const isWatcherKey = cached((key: string) => configs.watcherKeyRule.test(key));

function getPropType(
  obj: any,
  prop: string,
  type: PrototypeType
): keyof IPropTypeMap {
  const value = obj[prop];

  if (isFunction(value)) {
    if (isWatcherKey(prop)) {
      return "watcher";
    }

    return "method";
  }

  if (isUnobserveKeys(prop, type) || (isObject(value) && isFrozen(value))) {
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
        const type = getPropType(tpl, key, tplType);
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

function bindMethod(
  target: Prototype,
  { tpl, propTypeMap, type }: PrototypeConfig
) {
  const isComponent = type === PrototypeType.component;
  const isWx = configs.platform === "wx";

  const isLifeCycle = (prop: string) =>
    configs.platformConf[type].lifecycleKeys.indexOf(prop) >= 0;

  if (isComponent) {
    target.methods = {};

    if (isWx) {
      target.lifetimes = {};
    }
  }

  for (const key of propTypeMap.method.concat(propTypeMap.watcher)) {
    target[key] = tpl[key];

    if (isComponent) {
      if (isLifeCycle(key)) {
        if (isWx) {
          target.lifetimes[key] = tpl[key];
        }
      } else {
        target.methods[key] = tpl[key];
      }
    }
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

export function bind(tpl: RawPrototype, type: PrototypeType) {
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

  logger.log(type, "prototype is", target);
  if (type === "page") {
    configs.platformConf.page.ctor(target);
  } else {
    configs.platformConf.component.ctor(target);
  }
}

export function bindWxPage<T extends IWxPageCtor>(tpl: T) {
  bind(tpl, PrototypeType.page);
}

export function bindWxComponent<T extends IWxComponentCtor>(tpl: T) {
  bind(tpl, PrototypeType.component);
}
