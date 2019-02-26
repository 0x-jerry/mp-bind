/// <reference path="../@types/index.d.ts" />

import { def } from './utils';

/**
 * Use micro task to exec the last callback
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
    /*eslint-disable-next-line */
    global.pages = global.pages || [];
    /*eslint-disable-next-line */
    global.pages.push(this);

    def(this, 'setData', (obj, cb) => this.target.setData(obj, cb));

    const updateQueue = new UpdateTaskQueue(this);
    def(this, '__update_queue__', updateQueue);
    def(this, '$forceUpdate', () => updateQueue.updateData);
  }

  /**
   * Helper function, using in wxml file
   * update data accord to data-name
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

export { BasePage };
