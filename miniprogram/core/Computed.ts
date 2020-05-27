import { InternalInstance } from "./resolveInternal";
import { ProxyKeys } from "./config";
import { logger } from "./Logger";

class ComputedValue<V = any> {
  static current?: any = null;
  static all: ComputedValue[] = [];

  getter: () => V;

  instance: InternalInstance;
  name: string;
  value: V | null;

  constructor(instance: InternalInstance, name: string) {
    this.instance = instance;
    this.name = name;
    this.getter = this.getGetter();
    this.value = null;

    ComputedValue.all.push(this);
  }

  getGetter() {
    return this.instance[ProxyKeys.PROXY].getter[this.name]
  }

  update(onlyTrigger: boolean = false) {
    this.value = this.getter();
    logger("Computed update", this.name, this.value);

    if (onlyTrigger) {
      return;
    }

    const queue = this.instance[ProxyKeys.PROXY].updateTask;

    queue.push({
      mode: "computed",
      path: this.name,
      value: this.value as any,
    });
  }
}

export { ComputedValue };
