/// <reference path="../@types/index.d.ts" />

import { def, logger } from './utils';
import { BasePageConfig } from './config';

/**
 * Use micro task to update data
 */
class UpdateTaskQueue {
  /**
   *
   * @param {BasePage} page
   */
  constructor(page) {
    this.page = page;
    this.waitForUpdate = {};
    this.dirty = false;
  }

  addUpdateData(key, value) {
    this.waitForUpdate[key] = value;

    if (this.dirty) {
      return;
    }

    this.dirty = true;
    this.updateData();
  }

  updateData() {
    Promise.resolve().then(() => {
      logger('Update data', this.waitForUpdate);
      this.page.target.setData(this.waitForUpdate);
      this.waitForUpdate = {};
      this.dirty = false;
    });
  }
}

class BasePage {
  /**
   * @type {Page.PageInstance}
   */
  target = null;

  data = {};

  watch = {};

  computed = {};

  get route() {
    return this.target && this.target.route;
  }

  constructor() {
    if (BasePageConfig.debug) {
      /*eslint-disable-next-line */
      global.pages = global.pages || [];
      /*eslint-disable-next-line */
      global.pages.push(this);
    }

    def(this, BasePageConfig.keys.setData, (obj, cb) =>
      this.target.setData(obj, cb),
    );

    const updateQueue = new UpdateTaskQueue(this);
    def(this, BasePageConfig.keys.updateQueue, updateQueue);
    def(this, BasePageConfig.keys.forceUpdate, () => updateQueue.updateData);
  }

  /**
   * Helper function, uss in wxml file
   * update data accord to data-name
   * support `a.b.c`
   */
  inputHelper(e) {
    const names = e.currentTarget.dataset.name.split('.');
    let data = this.data;

    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      if (i === names.length - 1) {
        data[name] = e.detail.value;
      } else {
        data = data[names[i]];
      }
    }
  }

  checkboxHelper(e) {
    this.inputHelper(e);
  }
}

export { BasePage, UpdateTaskQueue };
