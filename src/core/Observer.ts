import { def, isObject, isFrozen } from "./utils";
import { ProxyKeys } from "./config";
import { IUpdateValueOption } from "./UpdateQueue";

interface IObserverUpdateOption {
  path: string;
  value: any;
  oldValue: any;
}

export interface IObserverOptions {
  update: (opt: IUpdateValueOption & IObserverUpdateOption) => void;
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

  constructor(data: ObserverData, opt: IObserverOptions) {
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
    if (isFrozen(target)) {
      return;
    }

    const ob: Observer | null = target[ProxyKeys.OB];

    if (ob) {
      ob.name = name;
      ob.prefix = this.prePath(name);
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
        this.parent?.setter(this.name, this.raw, {
          type: "array",
          method: method as any,
          params: args,
        });
      });
    }
  }

  setter(key: string, value: any, opt: IUpdateValueOption = { type: "plain" }) {
    const oldVal = this.raw[key];
    if (oldVal === value) {
      return;
    }

    this.raw[key] = value;
    this.update({
      ...opt,
      path: this.prePath(key),
      value,
      oldValue: oldVal,
    });

    if (isObject(value)) {
      this.createSubObserver(value, key);
    }
  }

  getter(key: string) {
    return this.raw[key];
  }
}
