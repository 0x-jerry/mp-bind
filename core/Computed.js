// eslint-disable-next-line no-unused-vars
import { UpdateTaskQueue } from './BasePage';
import { logger } from './utils';
import { BasePageConfig } from './config';

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

  update() {
    this.value = this.get();
    logger('Computed update', this.name, this.value);

    /**
     * @type {UpdateTaskQueue}
     */
    const queue = this.page[BasePageConfig.keys.updateQueue];

    queue.addUpdateData(this.name, this.value);
  }
}

export { ComputedValue };
