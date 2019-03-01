// pages/login/login.js
import { BasePage, bindPage } from '../../core/index';

export class Index extends BasePage {
  arr = [];
  prop = 1;

  get arrLength() {
    return this.arr.length;
  }

  onLoad() {
    this.arr.push(1);
  }

  changeProperties() {
    this.prop ++;
  }
}

bindPage(Index);
