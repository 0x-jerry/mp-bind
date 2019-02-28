// pages/login/login.js
import { BasePage, bindPage } from '../../core/index';

export class Index extends BasePage {
  arr = [];

  get arrLength() {
    return this.arr.length;
  }

  onLoad() {
    this.arr.push(1);
  }
}

bindPage(Index);
