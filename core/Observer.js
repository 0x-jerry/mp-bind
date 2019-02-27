import { def, logger } from './utils';
import { ComputedValue } from './Computed';

class Observer {
  /**
   *
   * @param {object} data
   * @param {(data:any)=>void} dataChanged update data function
   * @param {string} [name]
   * @param {string} [prePath]
   * @param {Observer} [parentOb]
   */
  constructor(data, dataChanged, name = '', prePath = '', parentOb = null) {
    this.parent = parentOb;
    this.dataChanged = dataChanged;
    this.name = name;
    this.prefix = prePath;
    this.data = {};
    this.isArray = Array.isArray(data);

    // dependence computed value
    // key => ComputedValue[]
    this.deps = {};
    logger('Observer new', this.prefix, data);

    def(data, '__ob__', this);
    def(this.data, '__ob__', this);

    if (this.isArray) {
      this.observeArrayMethods(data);
    }

    const obKeys = Object.keys(this.data);
    Object.keys(data).forEach((key) => {
      if (obKeys.indexOf(key) !== -1) {
        return;
      }
      this.observerKey(data, key);
    });
  }

  setter(key, value) {
    if (this.data[key] === value) {
      return;
    }

    logger('Observer set', this.prePath(key), value);

    // Calc needed update deps
    const computedDeps = this.calcDeps(this.data[key]);

    this.updateData(key, value);

    this.attachObserve(key, value);

    // When set a new Object
    // Trigger computed and update dependence
    if (computedDeps.length) {
      computedDeps.forEach((c) => {
        ComputedValue.current = c;
        c.update();
      });
      ComputedValue.current = null;
    } else {
      // Update computed value
      this.updateDeps(key);
    }
  }

  getter(key) {
    // For calculate compted dependence
    if (ComputedValue.current) {
      if (!this.deps[key]) {
        this.deps[key] = [];
      }

      const deps = this.deps[key];
      if (!deps.find((d) => d === ComputedValue.current)) {
        deps.push(ComputedValue.current);
      }
    }

    return this.safeGet(key);
  }

  observerKey(data, key) {
    const value = data[key];
    // Fix computed array, the getter is undefined
    this.data[key] = data[key];

    Object.defineProperty(data, key, {
      set: (val) => {
        this.setter(key, val);
      },
      get: () => {
        return this.getter(key);
      },
      configurable: true,
      enumerable: true,
    });

    // Update computed dependence
    if (this.isArray) {
      const deps = this.parent.deps[this.name] || [];
      deps.forEach((dep) => {
        ComputedValue.current = dep;
        dep.update();
      });
      ComputedValue.current = null;
    }

    this.attachObserve(key, value);
  }

  updateDeps(key) {
    // Update computed value
    const deps = this.deps[key];
    if (deps) {
      deps.forEach((target) => {
        target.update();
      });
    }
  }

  calcDeps(data) {
    let computedDeps = [];
    /**
     * @type {Observer}
     */
    const _ob = data['__ob__'];
    if (!_ob) return computedDeps;

    Object.keys(_ob.deps).forEach((key) => {
      computedDeps = computedDeps.concat(_ob.deps[key]);
      if (typeof _ob.data[key] === 'object') {
        const childDeps = this.calcDeps(_ob.data[key]);
        computedDeps = computedDeps.concat(childDeps);
      }
    });

    return computedDeps;
  }

  prePath(key) {
    if (!key) {
      return this.prefix;
    }

    if (Number.isInteger(+key)) {
      return this.prefix ? this.prefix + `[${key}]` : key;
    }

    return this.prefix ? this.prefix + '.' + key : key;
  }

  /**
   * @param {any[]} arr
   */
  observeArrayMethods(arr) {
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
        logger('Observer set', this.prePath(), method, ...args);
        const originMethod = Array.prototype[method];
        originMethod.apply(arr, args);

        // TODO reduce traverse times
        const obKeys = Object.keys(this.data);
        Object.keys(arr).forEach((key) => {
          if (obKeys.indexOf(key) !== -1) {
            return;
          }
          // Fix update data when `arr[xxx] = xxx`
          this.updateData(key, arr[key]);
          this.observerKey(arr, key);
        });

        // Update computed value
        if (this.parent) {
          this.parent.updateDeps(this.name);
        }
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
    const path = this.prePath(key);
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
    if (this.data[key] !== value) {
      this.data[key] = value;
    }

    if (typeof value === 'object') {
      new Observer(value, this.dataChanged, key, this.prePath(key), this);
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

export { Observer };
