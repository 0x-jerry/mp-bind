// pages/login/login.js
import { BasePage, bindPage } from '../../core/index';

export class Index extends BasePage {
  $data = {
    arr: [],
  };

  computed = {
    arrLength() {
      return this.$data.arr.length;
    }
  }

  onLoad() {
    this.$data.arr.push(1);
  }
}

bindPage(Index);
