import { nextTick, isObject, JSONClone, shallowEqual } from "./utils";
import { logger } from "./Logger";
import { InternalInstance } from "./resolveInternal";
import { ProxyKeys } from "./config";

export interface JSONLike {
  [key: string]:
    | JSONLike
    | null
    | string
    | number
    | symbol
    | boolean
    | JSONLike[];
}

export interface UpdateValue {
  path: string;
  mode: "data" | "watcher";
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
    const data = this.updateValues.reduce((pre, cur) => {
      if (cur.value === undefined) {
        pre[cur.path] = null;
        logger(`Detect set undefined: ${cur.path}`);
      } else {
        // 复制以防止修改 getter 影响 data
        pre[cur.path] = cur.value;
      }

      return pre;
    }, {} as JSONLike);

    Object.keys(this.internal[ProxyKeys.PROXY].propTypeMap.getter).forEach(
      (key) => {
        const oldVal = this.internal.data[key];
        const newVal = this.internal[key];
        if (!shallowEqual(oldVal, newVal)) {
          data[key] = newVal;
        }
      }
    );

    return JSONClone(data);
  }

  flush() {
    nextTick(() => {
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
