// @ts-nocheck

import { def, logger, isObject } from "./utils";
import { ComputedValue } from "./Computed";

const OB_KEY = "__ob__";

class Observer {
  parent?: Observer | null;
  dataChanged?: (newVal: any, oldVal: any) => void;
  name?: string;
  prefix?: string;
  data?: {};
  isArray?: boolean;
  deps?: {};

  constructor(
    data: object,
    dataChanged: (newVal: any, oldVal: any) => void,
    name: string = "",
    prePath: string = "",
    parentOb: Observer | null = null
  ) {
    if (Object.isFrozen(data)) {
      return;
    }

    this.parent = parentOb;
    this.dataChanged = dataChanged;
    this.name = name;
    this.prefix = prePath;
    this.data = {};
    this.isArray = Array.isArray(data);

    // key => ComputedValue[]
    this.deps = {};
    logger("Observer new", this.prefix, data);

    def(data, OB_KEY, this);
    def(this.data, OB_KEY, this);

    if (this.isArray) {
      this.observeArrayMethods(data as any);
    }

    const obKeys = Object.keys(this.data);
    Object.keys(data).forEach((key) => {
      if (obKeys.indexOf(key) !== -1) {
        return;
      }
      this.observerKey(data, key);
    });
  }

  setter(key: string, value: null | undefined) {
    // @ts-ignore
    if (this.data[key] === value) {
      return;
    }

    if (value === undefined) {
      logger(
        "Set value to undefined",
        this.prePath(key),
        value,
        ", auto use null instead"
      );
      value = null;
    }

    logger("Observer set", this.prePath(key), value);

    // @ts-ignore
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

  getter(key: string) {
    // Calculate compted dependence
    if (ComputedValue.current) {
      if (!this.deps[key]) {
        this.deps[key] = [];
      }

      const deps = this.deps[key];
      if (!deps.find((d: any) => d === ComputedValue.current)) {
        deps.push(ComputedValue.current);
      }
    }

    return this.safeGet(key);
  }

  observerKey(data: object, key: string | number | symbol) {
    const value = data[key];
    // Fix the getter is undefined when calculate computed first time
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
      deps.forEach((dep: { update: () => void }) => {
        ComputedValue.current = dep;
        dep.update();
      });
      ComputedValue.current = null;
    }

    this.attachObserve(key, value);
  }

  updateDeps(key: string | number | undefined) {
    // Update computed value
    const deps = this.deps[key];
    if (deps) {
      deps.forEach((target: { update: () => void }) => {
        target.update();
      });
    }
  }

  calcDeps(data: { [x: string]: any }) {
    let computedDeps: any[] = [];
    /**
     * @type {Observer}
     */
    const _ob: Observer = isObject(data) && data[OB_KEY];
    if (!_ob) return computedDeps;

    Object.keys(_ob.deps).forEach((key: string | number) => {
      computedDeps = computedDeps.concat(_ob.deps[key]);
      if (isObject(_ob.data[key])) {
        const childDeps = this.calcDeps(_ob.data[key]);
        computedDeps = computedDeps.concat(childDeps);
      }
    });

    return computedDeps;
  }

  prePath(key: string | undefined) {
    if (!key) {
      return this.prefix;
    }

    if (Number.isInteger(+key)) {
      return this.prefix ? this.prefix + `[${key}]` : key;
    }

    return this.prefix ? this.prefix + "." + key : key;
  }

  /**
   * @param {any[]} target
   */
  observeArrayMethods(target: any[]) {
    const methods = [
      "push",
      "pop",
      "shift",
      "unshift",
      "splice",
      "sort",
      "reverse",
    ];

    methods.forEach((method) => {
      def(target, method, (...args: any) => {
        logger("Observer set", this.prePath(), method, ...args);
        const originMethod = Array.prototype[method];
        originMethod.apply(target, args);

        // TODO reduce traverse times
        const obKeys = Object.keys(this.data);
        Object.keys(target).forEach((key) => {
          if (obKeys.indexOf(key) !== -1) {
            return;
          }

          this.updateData(key, target[key]);
          this.observerKey(target, key);
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
  updateData(key: string, value: any) {
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
  attachObserve(key: string, value: any) {
    if (this.data[key] !== value) {
      this.data[key] = value;
    }

    if (isObject(value)) {
      // eslint-disable-next-line no-new
      new Observer(value, this.dataChanged, key, this.prePath(key), this);
    }
  }

  /**
   *
   * @param {string} key
   */
  safeGet(key: string) {
    return this.data[key];
  }
}

export { Observer };
