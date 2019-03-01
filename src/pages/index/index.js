//index.js
import { BasePage, bindPage } from '../../core/index';

export class Index extends BasePage {
  arr = [1, 2, 3];

  count = 3;

  obj = {
    deep: {
      c: 3,
    },
  };

  '$$obj.deep.c'(val, old) {
    this.log('obj.deep.c changed', val, old);
  }

  // watch count
  $$count(val, old) {
    this.obj.deep.c += 5;
    this.log('count changed', val, old);
  }

  // computed
  get arrLength() {
    return this.arr.length;
  }

  log(name, newVal, oldVal) {
    console.log('watch', name, 'new:', newVal, 'old:', oldVal);
  }

  bindViewTap() {
    this.count += 1;
    this.arr.push(1);
    console.log('length', this.arrLength);
  }
}

bindPage(Index);
