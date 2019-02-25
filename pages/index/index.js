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
      return this.data.count * 2;
    },
  };

  log(name, newVal, oldVal) {
    console.log('watch', name, 'new:', newVal, 'old:', oldVal);
  }

  bindViewTap() {
    console.log('before update: self data', this.data.deep.a);
    console.log('before update: wx data', this.target.data.deep.a);
    this.data.deep.a = 2;
    console.log('after update: self data', this.data.deep.a);
    console.log('after update: wx data', this.target.data.deep.a);

    setTimeout(() => {
      console.log('timeout: wx data', this.target.data.deep.a);
    });

    this.data.motto = 'ok';
  }

  onLoad() {
    this.data.arr.push(1);
    console.log('app loaded');
  }
}

bindPage(new Index());
