// eslint-disable-next-line no-unused-vars
import { UpdateTaskQueue } from './Base';
import { logger } from './utils';
import { BaseConfigs } from './config';

class ComputedValue {
  // current `ComputedValue`, for calculate dependence
  static current = null;
  static all = [];

  /**
   *
   * @param {BasePage} page
   * @param {string} name
   * @param {() => any} getFunc
   */
  constructor(page, name, getFunc) {
    this.page = page;
    this.get = getFunc;
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
    const queue = this.page[BaseConfigs.keys.updateQueue];

    queue.addUpdateData(this.name, this.value);
  }
}

export { ComputedValue };
