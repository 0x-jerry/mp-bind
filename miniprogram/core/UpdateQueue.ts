import { nextTick, isObject } from "./utils";
import { logger } from "./Logger";

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
  page: Page.PageInstance;
  updateValues: UpdateValue[];
  waitForUpdate: boolean;

  constructor(page: Page.PageInstance) {
    this.page = page;
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

  flush() {
    nextTick(() => {
      const data = this.compose();
      logger("Update data", data, this.updateValues);
      this.page.setData!(data);
      this.updateValues = [];
      this.waitForUpdate = false;
    });
  }
}

export function getUpdateType(obj: any) {
  return Array.isArray(obj) ? "array" : isObject(obj) ? "object" : "plain";
}
