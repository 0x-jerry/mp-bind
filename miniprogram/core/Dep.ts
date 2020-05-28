import { Watcher } from "./Watcher";

export class Dep {
  static current: Watcher | null = null;
  static all: Dep[] = [];
  subs: Set<Watcher>;

  constructor() {
    this.subs = new Set();

    Dep.all.push(this);
  }

  notify() {
    this.subs.forEach((ob) => {
      ob.update();
    });
  }

  sub(watcher: Watcher) {
    this.subs.add(watcher);
    watcher.addDep(this);
  }

  unSub(watcher: Watcher) {
    this.subs.delete(watcher);
  }

  clear() {
    this.subs.clear();
  }
}
