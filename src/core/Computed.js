// eslint-disable-next-line no-unused-vars
import { UpdateTaskQueue } from './Base';
import { logger } from './utils';

class ComputedValue {
  // current `ComputedValue`, for calculate dependence
  static current = null;
  static all = [];

  /**
   * @param {string} name
   * @param {() => any} getFunc
   */
  constructor(proxyObj, name, getFunc) {
    this.get = getFunc;
    this.proxyObj = proxyObj;
    this.name = name;
    ComputedValue.all.push(this);
  }

  update(onlyTrigger = false) {
    this.value = this.get();
    logger('Computed update', this.name, this.value);

    if(onlyTrigger) {
      return;
    }

    /**
     * @type {UpdateTaskQueue}
     */
    const queue = this.proxyObj.updateQueue;

    queue.addUpdateData(this.name, this.value);
  }
}

export { ComputedValue };
