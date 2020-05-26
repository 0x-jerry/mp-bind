import { logger } from "./utils";
import { InternalInstance } from "./resolveInternal";

class ComputedValue<V = any> {
  static current?: any = null;
  static all: ComputedValue[] = [];

  getter: () => V;

  instance: InternalInstance;
  name: string;
  value: V | null;

  constructor(instance: InternalInstance, name: string, getter: () => V) {
    this.getter = getter;
    this.instance = instance;
    this.name = name;
    this.value = null;

    ComputedValue.all.push(this);
  }

  update(onlyTrigger: boolean = false) {
    this.value = this.getter();
    logger("Computed update", this.name, this.value);

    if (onlyTrigger) {
      return;
    }

    const queue = this.instance.updateTask;

    queue.push({
      mode: "computed",
      path: this.name,
      value: this.value as any,
    });
  }
}

export { ComputedValue };
