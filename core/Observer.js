import { def, logger } from './utils';
import { ComputedValue } from './Computed';

class Observer {
  /**
   *
   * @param {object} data
   * @param {(data:any)=>void} dataChanged update data function
   * @param {string} [prePath]
   */
  constructor(data, dataChanged, prePath = '') {
    this.dataChanged = dataChanged;
    this.prefix = prePath;
    this.data = {};
    // dependence computed value
    // key => ComputedValue[]
    this.deps = {};
    logger('Observer new', this.prefix, data);

    def(data, '__ob__', this);

    if (Array.isArray(data)) {
      this.observeArrayMethods(data);
    }

    Object.keys(data).forEach((key) => {
      const value = data[key];

      Object.defineProperty(data, key, {
        set: (val) => {
          if (this.data[key] === val) {
            return;
          }

          logger('Observer set', this.prePath(key), val);

          // Calc needed update deps
          let computedDeps = [];
          if (typeof val === 'object') {
            const calcDeps = (data) => {
              /**
               * @type {Observer}
               */
              const _ob = data['__ob__'];
              if(!_ob) return;

              Object.keys(_ob.deps).forEach((key) => {
                computedDeps = computedDeps.concat(_ob.deps[key]);
                if (typeof _ob.data[key] === 'object') {
                  calcDeps(_ob.data[key]);
                }
              });
            };
            calcDeps(this.data[key])
          }

          this.updateData(key, val);

          this.attachObserve(key, val);

          // When set a new Object
          // Trigger computed and update dependence
          if (typeof val === 'object') {
            computedDeps.forEach((c) => {
              ComputedValue.current = c;
              c.update();
            });
            ComputedValue.current = null;
          }

          // Update computed value
          const deps = this.deps[key];
          if (deps) {
            deps.forEach((target) => {
              target.update();
            });
          }
        },
        get: () => {
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
        },
        configurable: true,
        enumerable: true,
      });

      this.attachObserve(key, value);
    });
  }

  prePath(key) {
    if (!key) {
      return this.prefix;
    }
    return this.prefix ? this.prefix + '.' + key : key;
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
    if(this.data[key] !== value) {
      this.data[key] = value;
    }

    if (value['__ob__']) {
      return;
    }

    if (typeof value === 'object') {
      new Observer(value, this.dataChanged, this.prePath(key));
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
