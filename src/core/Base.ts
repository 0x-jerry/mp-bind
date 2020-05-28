import { BaseConfigs } from "./config";

export class Base {
  /**
   * update data accord to attribute `data-name`
   * support `a.b.c` syntax
   */
  inputHelper(e: {
    currentTarget: { dataset: { name: string } };
    detail: { value: any };
  }) {
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
}

export class BasePage extends Base {
  constructor() {
    super();
    if (BaseConfigs.debug) {
      // @ts-ignore
      (Page.pages = Page.pages || []).push(this);
    }
  }
}

export class BaseComponent extends Base {
  properties = {};
}
