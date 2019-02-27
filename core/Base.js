/// <reference path="../@types/index.d.ts" />

import { def, logger } from './utils';
import { BaseConfigs } from './config';

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

class Base {
  data = {};

  watch = {};

  computed = {};

  constructor() {
    if (BaseConfigs.debug) {
      /*eslint-disable-next-line */
      global.pages = global.pages || [];
      /*eslint-disable-next-line */
      global.pages.push(this);
    }

    def(this, BaseConfigs.keys.setData, (obj, cb) =>
      this.target.setData(obj, cb),
    );

    const updateQueue = new UpdateTaskQueue(this);
    def(this, BaseConfigs.keys.updateQueue, updateQueue);
    def(this, BaseConfigs.keys.forceUpdate, () => updateQueue.updateData);
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

class BasePage extends Base {
  /**
   * @type {Page.PageInstance}
   */
  target = null;

  get route() {
    return this.target && this.target.route;
  }
}

class BaseComponent extends Base {
  /**
   * @type {Component.ComponentConstructor}
   */
  target = null;
}

export { BasePage, UpdateTaskQueue, BaseComponent };
