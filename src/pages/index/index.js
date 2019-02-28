//index.js
import { BasePage, bindPage } from '../../core/index';

export class Index extends BasePage {
  arr = [1, 2, 3];

  count = 3;

  // watch count
  $$count(val, old) {
    this.log('count changed', val, old);
  }

  get arrLength() {
    return this.arr.length
  }

  log(name, newVal, oldVal) {
    console.log('watch', name, 'new:', newVal, 'old:', oldVal);
  }

  bindViewTap() {
    console.log('tap', this);
    this.count += 1;
    this.arr.push(1);
  }
}

bindPage(Index);
