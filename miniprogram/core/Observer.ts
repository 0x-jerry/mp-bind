import { ComputedValue } from "./Computed";
import { def, isObject } from "./utils";
import { ProxyKeys } from "./config";

export interface IObserverOptions {
  update: <T = any>(path: string, newVal: T, oldVal: T) => void;
  name?: string;
  prefix?: string;
  parent?: Observer;
  isArray?: boolean;
}

export type ObserverData = Record<string, any>;

export class Observer {
  readonly isArray: boolean;

  parent?: Observer;
  update: IObserverOptions["update"];
  name: string;
  prefix: string;
  raw: ObserverData;
  deps: Record<string, Set<ComputedValue>>;

  constructor(data: ObserverData, opt: IObserverOptions) {
    this.deps = {};

    this.parent = opt.parent;
    this.update = opt.update;
    this.prefix = opt.prefix || "";
    this.name = opt.name || "";
    this.isArray = Array.isArray(data);
    this.raw = this.isArray ? [] : {};

    def(data, ProxyKeys.OB, this);

    if (this.isArray) {
      this.observeArray(data as []);
    } else {
      Object.keys(data).forEach((key) => {
        this.observe(data, key);
      });
    }
  }

  prePath(key?: string) {
    if (!key) {
      return this.prefix;
    }

    if (Number.isInteger(+key)) {
      return this.prefix ? this.prefix + `[${key}]` : key;
    }

    return this.prefix ? this.prefix + "." + key : key;
  }

  observe(target: any, key: string) {
    const value = (this.raw[key] = target[key]);

    Object.defineProperty(target, key, {
      set: (val) => this.setter(key, val),
      get: () => this.getter(key),
    });

    if (isObject(value) || Array.isArray(value)) {
      this.createSubObserver(value, key);
    }
  }

  observeArray(target: any[]) {
    this.observeArrayMethod(target);

    for (const idx in target) {
      const item = target[idx];
      this.observe(target, idx);

      if (isObject(item) || Array.isArray(item)) {
        this.createSubObserver(item, idx);
      }
    }
  }

  createSubObserver(target: any, name: string) {
    if (target[ProxyKeys.OB]) {
      return;
    }

    new Observer(target, {
      parent: this,
      name: name,
      prefix: this.prePath(name),
      update: this.update,
    });
  }

  observeArrayMethod(target: any[]) {
    const methods = [
      "push",
      "pop",
      "shift",
      "unshift",
      "splice",
      "sort",
      "reverse",
    ];

    for (const method of methods) {
      def(target, method, (...args: any) => {
        this.raw[method](...args);
        this.parent?.setter(this.name, this.raw);
      });
    }
  }

  setter(key: string, value: any) {
    const oldVal = this.raw[key];
    if (oldVal === value) {
      return;
    }

    this.raw[key] = value;
    this.update(this.prePath(key), value, oldVal);

    if (isObject(value)) {
      this.createSubObserver(value, key);
    }
  }

  getter(key: string) {
    return this.raw[key];
  }
}
