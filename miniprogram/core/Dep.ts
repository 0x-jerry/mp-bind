import { Watcher } from "./Watcher";

export class Dep {
  static current: Watcher | null = null;
  subs: Set<Watcher>;

  constructor() {
    this.subs = new Set();
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
