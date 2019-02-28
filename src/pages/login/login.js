// pages/login/login.js
import { BasePage, bindPage } from '../../core/index';

export class Index extends BasePage {
  data = {
    arr: 1,
  };

  onLoad() {
    this.data.arr = 20;
  }
}

bindPage(Index);
