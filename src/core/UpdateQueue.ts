import { nextTick, isObject, JSONClone, shallowEqual } from "./utils";
import { logger } from "./Logger";
import { InternalInstance } from "./resolveInternal";
import { ProxyKeys, configs } from "./config";
import { ArrayMethod, calcSpliceParam, isSupportArrayMethod } from "./ali";

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

export interface IUpdateArrayOption {
  type: "array";
  method: ArrayMethod;
  params: any[];
  len: number;
}

export interface IUpdatePlainOption {
  type: "plain";
}

export type IUpdateValueOption = IUpdatePlainOption | IUpdateArrayOption;

export interface IUpdateValue {
  path: string;
  value: JSONLike | JSONLike[];
}

export type UpdateValue = IUpdateValue & IUpdateValueOption;

function getSafeValue(path: string, val: any) {
  if (val === undefined) {
    logger.warn(`Detect undefined: ${path}`);
    // logger()
  }
  return val === undefined ? null : val;
}

export class UpdateTaskQueue {
  internal: InternalInstance;
  updateValues: Map<string, IUpdateValue & IUpdatePlainOption>;
  waitForUpdate: boolean;
  updateArrayValues: Map<string, IUpdateValue & IUpdateArrayOption>;

  constructor(page: InternalInstance) {
    this.internal = page;
    this.updateValues = new Map();
    this.updateArrayValues = new Map();
    this.waitForUpdate = false;
  }

  push(value: UpdateValue) {
    if (value.type === "array") {
      this.updateArrayValues.set(value.path, value);
    } else {
      this.updateValues.set(value.path, value);
    }

    if (this.waitForUpdate) {
      return;
    }

    this.waitForUpdate = true;
    this.flush();
  }

  composeData() {
    const data: Record<string, any> = {};

    this.updateValues.forEach(
      (val) => (data[val.path] = getSafeValue(val.path, val.value))
    );

    return data;
  }

  computeGetter() {
    const data: JSONLike = {};

    Object.keys(this.internal[ProxyKeys.PROXY].propTypeMap.getter).forEach(
      (key) => {
        const oldVal = this.internal.data[key];
        const newVal = this.internal[key];
        if (!shallowEqual(oldVal, newVal)) {
          data[key] = newVal;
        }
      }
    );

    return data;
  }

  composeArray() {
    const data: Record<string, any> = {};

    this.updateArrayValues.forEach((val) => {
      if (configs.platform === "ali" && isSupportArrayMethod(val.method)) {
        data[val.path] = calcSpliceParam(val.method, val.params, val.len);
      } else {
        this.push({
          ...val,
          type: "plain",
        });
      }
    });

    return JSONClone(data);
  }

  compose() {
    // 必须先计算 array，因为，如果 array 不支持优化，就会后退到 data
    const array = this.composeArray();
    const getter = this.computeGetter();
    const data = this.composeData();

    return {
      array,
      data: Object.assign({}, data, getter),
    };
  }

  flush() {
    nextTick(() => {
      this.setData();
      this.updateValues.clear();
      this.updateArrayValues.clear();
      this.waitForUpdate = false;
    });
  }

  setData() {
    const data = JSONClone(this.compose());

    this.internal.setData!(data.data);
    logger.log(`Set data`, data.data);

    if (configs.platform === "ali") {
      this.internal.$spliceData(data.array);
      logger.log(`Set array`, data.array);
    }
  }
}

export function getUpdateType(obj: any) {
  return Array.isArray(obj) ? "array" : isObject(obj) ? "object" : "plain";
}
