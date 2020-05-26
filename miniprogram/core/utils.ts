import { BaseConfigs } from "./config";

export function JSONClone<T>(data: T): T {
  return data === undefined ? undefined : JSON.parse(JSON.stringify(data));
}

export function def(
  obj: Object,
  prop: string,
  val: any,
  enumerable: boolean = false
) {
  if (!isObject(obj) && typeof obj !== "function") {
    console.warn("defineProperty should call on object", obj);
    return;
  }

  Object.defineProperty(obj, prop, {
    value: val,
    enumerable,
    writable: true,
    configurable: true,
  });
}

export function logger(...args: any) {
  if (BaseConfigs.debug) {
    const prefix = `${new Date().toISOString()}: `;
    console.log(prefix, ...args);
  }
}

export function isObject(target: any) {
  return typeof target === "object" && target !== null;
}

export function isFunction(target: any) {
  return typeof target === "function";
}

export function nextTick(func: Function) {
  Promise.resolve().then(() => func());
}
