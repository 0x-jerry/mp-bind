import { bindWxComponent } from "../mp-bind/bind.esm";

bindWxComponent({
  properties: {
    name: String,
  },
  times: 1,
  click() {
    this.times++;
  },
  $$times(newVal, oldVal) {
    console.log("click changed", newVal, oldVal);
  },
});
