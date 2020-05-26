// eslint-disable-next-line no-unused-vars
import { logger } from "./utils";
import { UpdateTaskQueue } from "./Base";

class ComputedValue {
  // current `ComputedValue`, for calculate dependence
  static current: any = null;
  static all: any = [];
  get: () => any;
  proxyObj: any;
  name: string;
  value: any;

  /**
   * @param {string} name
   * @param {() => any} getFunc
   */
  constructor(proxyObj: any, name: string, getFunc: () => any) {
    this.get = getFunc;
    this.proxyObj = proxyObj;
    this.name = name;
    ComputedValue.all.push(this);
  }

  update(onlyTrigger = false) {
    this.value = this.get();
    logger("Computed update", this.name, this.value);

    if (onlyTrigger) {
      return;
    }

    /**
     * @type {UpdateTaskQueue}
     */
    const queue: UpdateTaskQueue = this.proxyObj.updateQueue;

    queue.addUpdateData(this.name, this.value);
  }
}

export { ComputedValue };
