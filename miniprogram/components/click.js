import { bindWxComponent } from "../mp-bind/bind.esm";

bindWxComponent({
  // 定义 properties
  properties: {
    name: String,
  },
  // 定义 data
  times: 1,
  // 定义函数
  click() {
    this.times++;
  },
  // watch 函数
  $$times(newVal, oldVal) {
    console.log("click changed", newVal, oldVal);
  },
});
