import { nextTick, isObject, shallowEqual } from "./utils";
import { logger } from "./Logger";
import { InternalInstance } from "./resolveInternal";
import { ProxyKeys } from "./config";

export interface JSONLike {
  [key: string]: JSONLike | string | number | symbol | boolean | JSONLike[];
}

export interface UpdateValue {
  path: string;
  mode: "data" | "computed";
  type?: "plain" | "object" | "array";
  method?: keyof Array<any>;
  value: JSONLike | JSONLike[];
}

export class UpdateTaskQueue {
  internal: InternalInstance;
  updateValues: UpdateValue[];
  waitForUpdate: boolean;

  constructor(page: InternalInstance) {
    this.internal = page;
    this.updateValues = [];
    this.waitForUpdate = false;
  }

  push(value: UpdateValue) {
    this.updateValues.push(value);

    if (this.waitForUpdate) {
      return;
    }

    this.waitForUpdate = true;
    this.flush();
  }

  compose() {
    return this.updateValues.reduce((pre, cur) => {
      pre[cur.path] = cur.value;
      return pre;
    }, {} as JSONLike);
  }

  flushGetters() {
    const getters = this.internal[ProxyKeys.PROXY].getter;

    for (const key in getters) {
      const getter = getters[key];
      const newVal = getter();
      const oldVal = this.internal.data[key];

      if (shallowEqual(newVal, oldVal)) {
        continue;
      }

      this.updateValues.push({
        mode: "computed",
        path: key,
        value: newVal,
      });
    }
  }

  flush() {
    nextTick(() => {
      this.flushGetters();

      const data = this.compose();
      logger("Update data", data, this.updateValues);
      this.internal.setData!(data);
      this.updateValues = [];
      this.waitForUpdate = false;
    });
  }
}

export function getUpdateType(obj: any) {
  return Array.isArray(obj) ? "array" : isObject(obj) ? "object" : "plain";
}
