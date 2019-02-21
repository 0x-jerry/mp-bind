//index.js
/// <reference path="../../@types/index.d.ts" />
import { BasePage, bindPage } from "../../utils/base";

export class Index extends BasePage {
  data = {
    motto: "Hello World",
    count: 0
  };

  bindViewTap() {
    this.data.motto = "ok";
  }
  onLoad() {
    console.log("app loaded");
  }
}

bindPage(new Index());
