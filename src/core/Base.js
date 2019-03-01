import { logger } from './utils';
import { BaseConfigs } from './config';

/**
 * Use micro task to update data
 */
class UpdateTaskQueue {
  /**
   *
   * @param {Page.PageInstance} page
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
      this.page.setData(this.waitForUpdate);
      this.waitForUpdate = {};
      this.dirty = false;
    });
  }
}

class Base {
  constructor(base) {
    if (BaseConfigs.debug && base) {
      global.pages = global.pages || [];
      global.pages.push(this);
    }
  }

  /**
   * Helper function, uss in wxml file
   * update data accord to data-name
   * support `a.b.c`
   */
  inputHelper(e) {
    const names = e.currentTarget.dataset.name.split('.');

    let data = this;
    try {
      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        if (i === names.length - 1) {
          data[name] = e.detail.value;
        } else {
          data = data[name];
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }

  checkboxHelper(e) {
    this.inputHelper(e);
  }
}

class BasePage extends Base {
  /**
   *
   * @param {Page.PageInstance} base
   */
  constructor(base) {
    super(base);
  }
}

class BaseComponent extends Base {
  properties = {};

  /**
   *
   * @param {Component.ComponentConstructor} base
   */
  constructor(base) {
    super(base);
  }
}

export { BasePage, UpdateTaskQueue, BaseComponent };
