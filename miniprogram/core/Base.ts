import { logger } from "./utils";
import { BaseConfigs } from "./config";

/**
 * Use micro task to update data
 */
class UpdateTaskQueue {
  page: Page.PageInstance<any, any>;
  waitForUpdate: any;
  dirty: boolean;

  constructor(page: Page.PageInstance) {
    this.page = page;
    this.waitForUpdate = {};
    this.dirty = false;
  }

  addUpdateData(key: string | number, value: any) {
    this.waitForUpdate[key] = value;

    if (this.dirty) {
      return;
    }

    this.dirty = true;
    this.updateData();
  }

  updateData() {
    Promise.resolve().then(() => {
      logger("Update data", this.waitForUpdate);
      this.page.setData!(this.waitForUpdate);
      this.waitForUpdate = {};
      this.dirty = false;
    });
  }
}

class Base {
  constructor(base: any) {
    if (BaseConfigs.debug && base) {
      // @ts-ignore
      global.pages = global.pages || [];
      // @ts-ignore
      global.pages.push(this);
    }
  }

  /**
   * update data accord to attribute `data-name`
   * support `a.b.c` syntax
   */
  inputHelper(e: { currentTarget: { dataset: { name: string; }; }; detail: { value: any; }; }) {
    const names = e.currentTarget.dataset.name.split(".");

    let data: any = this;
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

  checkboxHelper(e: { currentTarget: { dataset: { name: string; }; }; detail: { value: any; }; }) {
    this.inputHelper(e);
  }
}

class BasePage extends Base {}

class BaseComponent extends Base {
  properties = {};
}

export { BasePage, UpdateTaskQueue, BaseComponent };
