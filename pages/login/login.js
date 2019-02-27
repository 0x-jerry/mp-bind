// pages/login/login.js
/// <reference path="../../@types/index.d.ts" />
import { BasePage, bindPage } from '../../core/index';

export class Index extends BasePage {
  data = {
    arr: 1,
  };

  onLoad() {
    this.data.arr = 20;
  }
}

bindPage(new Index());
