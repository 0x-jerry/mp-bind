import { logger } from "./Logger";

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
