//index.js
/// <reference path="../../@types/index.d.ts" />
import { BasePage, bindPage } from '../../core/index';

export class Index extends BasePage {
  data = {
    motto: 'Hello World',
    count: 1,
    deep: {
      a: 1,
    },
    arr: [1, 2, 3],
  };

  /**
   * Notice: If you want `this` point to this page, please use arrow function
   */
  watch = {
    'deep.a': (val, old) => {
      // here the `this` is point to this class
      this.log('deep.a', val, old);
    },
    motto(val, old) {
      // here the `this` is point to `watch` object
      console.log('watch motto', 'new:', val, 'old:', old);
    },
  };

  computed = {
    dbCount: () => {
      return this.data.count * 2 + this.data.deep.a + (this.data.deep.b || 0);
    },
    arrLength: () => {
      return this.data.arr.length;
    },
  };

  log(name, newVal, oldVal) {
    console.log('watch', name, 'new:', newVal, 'old:', oldVal);
  }

  bindViewTap() {
    this.data.arr[3] = 5;
    // const updated = {};
    // updated['arr[4]'] = 5;
    // this.setData(updated);
    this.data.deep = { a: 4, b: 2 };
  }

  onLoad() {
    // this.data.arr.push(1, 2, 3);
    this.data.arr[1] = 4;
    this.data.arr.push(32);
  }
}

bindPage(new Index());
