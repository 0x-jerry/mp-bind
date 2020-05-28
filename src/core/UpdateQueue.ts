import { nextTick, isObject, JSONClone } from "./utils";
import { logger } from "./Logger";
import { InternalInstance } from "./resolveInternal";

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
    return this.updateValues.reduce((pre, cur) => {
      // 复制以防止修改 getter 影响 data
      pre[cur.path] = cur.value === undefined ? null : JSONClone(cur.value);
      logger(`Detect set undefined: ${cur.path}`)

      return pre;
    }, {} as JSONLike);
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
