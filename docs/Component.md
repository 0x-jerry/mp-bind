# Page 定义

```js
class IndexComponent {
  // properties 定义
  props = {
    text: {
      type: String,
      value: 0,
    },
  };

  // 混合
  mixins = [];

  // 组件关系
  relations = {};

  // 外部样式类
  externalClasses = [];

  // 选项、配置
  options = {};

  // data，自动调用 setData 更新
  arr = [];
  str = 3;

  // getter，自动调用 setData 更新
  get plusOne() {
    return str + 1;
  }

  // frozen object，{ a: 1 } 不会响应， freeze 会
  freeze = Object.freeze({ a: 1 });

  // un observe data，不会自动更新到视图
  _str = 3;
  // 不会自动更新到视图，但是会获取到正确的值
  get _plusOne() {}

  // 监听函数，可监听 prop 和 响应式 data
  $$str(newVal, oldVal) {
    console.log("str update", newVal, oldVal);
  }

  // 监听函数，可监听 prop 和 响应式 data
  $$text(newVal, oldVal) {
    console.log("text update", newVal, oldVal);
  }

  // 生命周期
  onCreated() {
    console.log("component create");
  }

  // 函数
  tap() {
    console.log("tap");
  }
}
```
