# Page 定义

```js
class IndexPage {
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

  // 监听函数
  $$str(newVal, oldVal) {
    console.log("msg update", newVal, oldVal);
  }

  // 生命周期
  onLoad() {
    console.log("page loaded");
  }

  // 函数
  tap() {
    console.log("tap");
  }
}
```
