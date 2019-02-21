/// <reference path="../@types/index.d.ts" />

function JSONClone(data) {
  return JSON.parse(JSON.stringify(data || {}));
}

/**
 *
 * @param {BasePage} target
 */
function bindData(target) {
  const data = target.data;

  Object.keys(data).forEach(key => {
    Object.defineProperty(data, key, {
      set(val) {
        const changedData = {};
        changedData[key] = val;
        target.setData(changedData);
      },
      get() {
        return target.target.data[key];
      },
      configurable: true,
      enumerable: true
    });
  });
}

/**
 *
 * @param {BasePage} target
 */
function bindPage(target) {
  let proto = target;

  const registerObj = {
    data: JSONClone(target.data),
    onLoad() {
      target.target = this;
      target.onLoad && target.onLoad();
    }
  };

  const filterKeys = ["constructor", "onLoad", "data", "setData"];

  while (!proto.isPrototypeOf(Object)) {
    Object.getOwnPropertyNames(proto)
      .filter(
        key =>
          filterKeys.indexOf(key) === -1 && typeof target[key] === "function"
      )
      .forEach(key => {
        registerObj[key] = (...args) => target[key](...args);
      });

    proto = Object.getPrototypeOf(proto);
  }

  Page(registerObj);
  bindData(target);
}

class BasePage {
  /**
   * @type {Page.PageInstance}
   */
  target = null;

  data = {};

  get route() {
    return this.target && this.target.route;
  }

  setData(obj, cb) {
    this.target.setData(obj, cb);
  }
}

export { BasePage, bindPage };
