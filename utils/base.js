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
    configurable: true,
  });
}

class Observer {
  /**
   *
   * @param {JSON} data
   * @param {(data:any)=>void} dataChanged
   * @param {string} [prePath]
   */
  constructor(data, dataChanged, prePath = '') {
    this.dataChanged = dataChanged;
    this.prefix = prePath;
    this.data = {};
    def(data, '__ob__', this);

    Object.keys(data).forEach((key) => {
      const value = data[key];
      this.attachObserve(key, value);

      Object.defineProperty(data, key, {
        set: (val) => {
          this.updateData(key, val);

          this.attachObserve(key, val);
        },
        get: () => {
          return this.safeGet(key);
        },
        configurable: true,
        enumerable: true,
      });
    });
  }

  /**
   *
   * @param {any[]} arr
   * @param {string} key
   */
  observeArrayMethods(arr, key) {
    const methods = [
      'push',
      'pop',
      'shift',
      'unshift',
      'splice',
      'sort',
      'reverse',
    ];

    methods.forEach((method) => {
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
    const path = this.prefix ? this.prefix + '.' + key : key;
    changedData[path] = value;
    const oldData = {};
    oldData[path] = this.data[key];

    this.dataChanged(changedData, oldData);
  }

  /**
   *
   * @param {string} key
   * @param {any} value
   */
  attachObserve(key, value) {
    this.data[key] = value;

    if (value['__ob__']) {
      return;
    }

    if (Array.isArray(value)) {
      this.observeArrayMethods(value, key);
    } else if (typeof value === 'object') {
      const prefix = this.prefix ? this.prefix + '.' + key : key;
      new Observer(value, this.dataChanged, prefix);
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
 * Use micro task to exec the last callback
 */
const UpdateTaskQueue = {
  tasks: [],
  push(cb) {
    this.tasks.push(cb);

    if (this.tasks.length > 1) {
      return;
    }

    //micro task
    Promise.resolve().then(() => {
      this.tasks.pop()();
      this.tasks = [];
    });
  },
};

/**
 *
 * @param {BasePage} target
 */
function bindPage(target) {
  let proto = target;

  const initData = JSONClone(target.data);
  def(target, '__init_data__', initData);

  const registerObj = {
    data: initData,
    onLoad(...args) {
      target.target = this;
      const _initData = target['__init_data__'];

      // Update init data
      Object.keys(_initData).forEach((key) => {
        target.data[key] = JSONClone(_initData[key]);
      });

      target.onLoad && target.onLoad(...args);
    },
  };

  const filterKeys = ['constructor', 'onLoad', 'data', 'setData'];

  while (!proto.isPrototypeOf(Object)) {
    Object.getOwnPropertyNames(proto)
      .filter(
        (key) =>
          filterKeys.indexOf(key) === -1 && typeof target[key] === 'function',
      )
      .forEach((key) => {
        registerObj[key] = (...args) => target[key](...args);
      });

    proto = Object.getPrototypeOf(proto);
  }

  Page(registerObj);
  let waitUpdateData = {};

  new Observer(target.data, (newData, oldData) => {
    // Update sync, both target.data.xxx and target.target.data.xxx are updated
    // target.target.setData(arg);

    // Watch
    Object.keys(newData).forEach((key) => {
      waitUpdateData[key] = newData[key];

      if (typeof target.watch[key] === 'function') {
        target.watch[key](newData[key], oldData[key]);
      }
    });

    /**
     * update merge test (update in micro task)
     * notice： target.data.xxx is update sync
     *          but, target.target.data.xxx not update
     *          it will update in micro task, one solution is use `setTimeout(() => data.xxx)`
     *          if you want update sync, use target.setData
     */
    UpdateTaskQueue.push(() => {
      target.target.setData(waitUpdateData);
      waitUpdateData = {};
    });
  });
}

class BasePage {
  /**
   * @type {Page.PageInstance}
   */
  target = null;

  data = {};

  watch = {};

  get route() {
    return this.target && this.target.route;
  }

  /**
   * Helper function, using in wxml file
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