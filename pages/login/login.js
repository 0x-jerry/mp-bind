// pages/login/login.js
/// <reference path="../../@types/index.d.ts" />
import { BasePage, bindPage } from '../../core/index';

export class Index extends BasePage {
  data = {
    arr: [],
  };

  onLoad() {
    this.data.arr.push('1');
  }
}

bindPage(new Index());
