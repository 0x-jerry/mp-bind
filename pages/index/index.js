//index.js
/// <reference path="../../@types/index.d.ts" />
import { BasePage, bindPage } from '../../utils/base';

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
  };

  log(name, newVal, oldVal) {
    console.log('watch', name, 'new:', newVal, 'old:', oldVal);
  }

  bindViewTap() {
    this.data.deep = { a: 2, b: 3 };
  }

  onLoad() {
    this.data.arr.push(1);
    console.log('app loaded');
  }
}

bindPage(new Index());
