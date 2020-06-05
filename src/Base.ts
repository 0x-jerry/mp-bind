import { logger } from "./Logger";
import {
  IAliComponentCtor,
  IAliPageCtor,
  IWxComponentCtor,
  IWxPageCtor,
} from "./define";

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
    const value = e.detail.value;

    logger.log("input helper", names, value);

    let data: any = this;
    try {
      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        if (i === names.length - 1) {
          data[name] = value;
        } else {
          data = data[name];
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }
}

// ali
export class AliComponent<T> extends Base implements IAliComponentCtor<T> {
  props!: T;
}

export class AliPage extends Base implements IAliPageCtor {
  route!: string;
}

// wx
export class WxComponent<T> extends Base implements IWxComponentCtor<T> {
  properties!: T;
}

export class WxPage extends Base implements IWxPageCtor {
  route!: string;
}
