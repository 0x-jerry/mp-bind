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
    arr: [],
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
    threeCount: () => {
      return this.data.motto + '2';
    },
  };

  log(name, newVal, oldVal) {
    console.log('watch', name, 'new:', newVal, 'old:', oldVal);
  }

  bindViewTap() {
    this.data.deep = { a: 2, b: 3 };
  }

  onLoad() {
    this.data.arr.push(1);
  }
}

bindPage(new Index());
