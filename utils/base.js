/// <reference path="../@types/index.d.ts" />

/**
 *
 * @param {JSON} data
 */
function JSONClone(data) {
  return JSON.parse(JSON.stringify(data || {}));
}

/**
 *
 * @param {*} obj
 * @param {string} prop
 * @param {*} val
 * @param {boolean} [enumerable ]
 */
function def(obj, prop, val, enumerable = false) {
  Object.defineProperty(obj, prop, {
    value: val,
    enumerable,
    writable: true,
    configurable: true
  });
}

class Observe {
  /**
   *
   * @param {JSON} data
   * @param {(data:any)=>void} dataChanged
   * @param {string} [prePath]
   */
  constructor(data, dataChanged, prePath = "") {
    this.dataChanged = dataChanged;
    this.prefix = prePath;
    this.data = {};
    this.subOb = {};
    def(data, "__observed__", true);

    Object.keys(data).forEach(key => {
      const value = data[key];
      this.attachObserve(key, value);

      Object.defineProperty(data, key, {
        set: val => {
          this.updateData(key, val);

          this.attachObserve(key, val);
        },
        get: () => {
          return this.safeGet(key);
        },
        configurable: true,
        enumerable: true
      });
    });
  }

  /**
   *
   * @param {any[]} arr
   * @param {string} key
   */
  observeArrayMethods(arr, key) {
    this.data[key] = arr;

    const methods = [
      "push",
      "pop",
      "shift",
      "unshift",
      "splice",
      "sort",
      "reverse"
    ];

    methods.forEach(method => {
      def(arr, method, (...args) => {
        const originMethod = Array.prototype[method];
        originMethod.apply(arr, args);

        this.updateData(key, arr);
      });
    });
  }

  /**
   *
   * @param {string} key
   * @param {any} value
   */
  updateData(key, value) {
    const changedData = {};
    const path = this.prefix ? this.prefix + "." + key : key;
    changedData[path] = value;

    this.dataChanged(changedData);
  }

  /**
   *
   * @param {string} key
   * @param {any} value
   */
  attachObserve(key, value) {
    if (value["__observed__"]) {
      this.data[key] = value;
    } else if (Array.isArray(value)) {
      this.observeArrayMethods(value, key);
    } else if (typeof value === "object") {
      const prefix = this.prefix ? this.prefix + "." + key : key;

      this.data[key] = value;
      this.subOb[key] = new Observe(value, this.dataChanged, prefix);
    } else {
      this.data[key] = value;
    }
  }

  /**
   *
   * @param {string} key
   */
  safeGet(key) {
    return this.data[key];
  }
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

  def(
    target.data,
    "__ob__",
    new Observe(target.data, arg => {
      target.target.setData(arg);
    })
  );
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

  /**
   * Helper function, useing in wxml file
   * update data accord to data-name
   */
  inputHelper(e) {
    const name = e.currentTarget.dataset.name;
    this.data[name] = e.detail.value;
  }

  checkboxHelper(e) {
    this.inputHelper(e);
  }

  setData(obj, cb) {
    this.target.setData(obj, cb);
  }
}

export { BasePage, bindPage };
