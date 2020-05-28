import { InternalInstance } from "./resolveInternal";
import { ProxyKeys } from "./config";
import { Dep } from "./Dep";

export class Watcher {
  getter: () => {};
  value: any;
  name: string;
  internal: InternalInstance;
  deps: Set<Dep>;
  newDeps: Set<Dep>;

  constructor(internal: InternalInstance, name: string, getter: () => {}) {
    this.internal = internal;
    this.name = name;
    this.getter = getter;
    this.deps = new Set();
    this.newDeps = new Set();
    this.update();
  }

  update() {
    Dep.current = this;
    this.value = this.getter.call(this.internal);
    Dep.current = null;
    this.reset();
    this.internal[ProxyKeys.PROXY].updateTask.push({
      mode: "watcher",
      path: this.name,
      value: this.value,
    });
  }

  addDep(dep: Dep) {
    this.newDeps.add(dep);
  }

  reset() {
    this.deps.forEach((dep) => {
      if (!this.newDeps.has(dep)) {
        dep.unSub(this);
      }
    });

    [this.newDeps, this.deps] = [this.deps, this.newDeps];
    this.newDeps.clear();
  }
}
