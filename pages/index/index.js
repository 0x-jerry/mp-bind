//index.js
/// <reference path="../../@types/index.d.ts" />
import { BasePage, bindPage } from '../../core/index';

export class Index extends BasePage {
  data = {
    arr: [],
  };

  /**
   * Notice: If you want `this` point to this page, please use arrow function
   */
  watch = {
    arr: (newVal, oldVal) => {
      this.log('arr', newVal, oldVal);
    },
  };

  computed = {
    arrLength: () => this.data.arr.length,
    fistArr: () => {
      const arr = this.data.arr;
      return (arr && arr[5]) || '';
    },
  };

  log(name, newVal, oldVal) {
    console.log('watch', name, 'new:', newVal, 'old:', oldVal);
  }

  bindViewTap() {
    // this.data.arr = [1, 2, 3, 4];
    this.data.arr[0] = 5;
    this.data.arr.push(44);
    this.data.arr.push(55);
  }

  onLoad() {
    this.data.arr.push(3);
    this.data.arr.push(2);
    this.data.arr.push(1);
    this.data.arr.push(22);
    this.data.arr.push(33);
  }
}

bindPage(new Index());
