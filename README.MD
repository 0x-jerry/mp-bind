# 小程序数据绑定库

提升小程序开发体验的工具库

阿里小程序需要开启 component2: true，参考：https://opendocs.alipay.com/mini/framework/custom-component-overview#%E4%BD%BF%E7%94%A8%E9%A1%BB%E7%9F%A5

## Demo

请参考 `src/pages/index`

## 功能介绍

在使用之前，请先设置平台，`ali` 或者 `wx`，一般直接放在 app.js 里面就可以了

```js
// app.js
import { setConfig } from "mp-bind";

App({
  onLaunch(options) {
    console.info("App onLaunch");
  },
});

setConfig({ platform: "ali", debug: false });
```

注意入口改为 bind

```js
import { bind } from "mp-bind";

class A {
  ...
}

bind(new A());
```

1. 直接更新数据，不需要 setData

```js
class A {
  str = "1";

  arr = [];

  updateStr() {
    // 会自动更新页面数据
    this.str = "123";
    // 会自动更新页面数据
    this.arr.push(1);
  }
}
```

2. 默认保留字段 frozen 不会自动更新，Object.freeze 对象，也不会自动更新

```js
class A {
  frozen = {
    some: 1,
  };

  b = Object.freeze({
    a: 3,
  });

  str = 3;

  update() {
    // 不会更新页面数据
    this.frozen.some = 3;
    // 不会更新页面数据
    this.b.a = 4;

    // 会更新页面数据
    this.str = 4;
    // 会更新页面数据
    this.b = {
      a: 5,
    };
  }
}
```

frozen 为默认保留字段，可通过 setConfig 配置为其它字段

```js
setConfig({ unobserveKeys: ["unobserve"] });

class A {
  unobserve = {
    some: 1,
  };

  str = 3;

  update() {
    // 不会更新页面数据
    this.unobserve.some = 3;

    // 会更新页面数据
    this.str = 4;
  }
}
```

3. getter 会自动更新

```js
class A {
  str = 3;

  get plusOne() {
    return this.str + 1;
  }

  update() {
    // 会更新页面数据，此时页面上 plusOne 也会更新
    this.str = 4;
  }
}
```

4. 监听响应式数据

```js
class A {
  str = 3;

  a = {
    b: 3,
  };

  get plusOne() {
    return this.str + 1;
  }

  // 每当 str 的值更改，就会触发此函数
  $$str(newVal, oldVal) {
    console.log("str", newVal, oldVal);
  }

  // 支持路径写法
  "$$a.b"(newVal, oldVal) {
    console.log("str", newVal, oldVal);
  }

  // 不会生效，因为 plusOne 是 getter，不支持监听 getter
  $$plusOne(newVla, oldVal) {
    console.log("plus one", newVal, oldVal);
  }

  update() {
    // 会更新页面数据，而且会触发 `$$str` 函数
    this.str = 4;
    // 会更新页面数据，而且会触发 `$$a.b` 函数
    this.a.b = 4;
  }
}
```

默认前缀为 `$$` 的为监听函数，可通过 setConfig 修改

```js
setConfig({ watchPrefix: "$$" });
```

4. 内置辅助方法

BasePage 内置 `inputHelper` 方法，`inputHelper` 可根据 data-name 直接设置值

```js
class A extends BasePage {
  msg = 3;
}
```

```xml
<!-- 没当输入新的内容，就会自动更新 msg 的值为输入的值，支持路径写法，例如 data-name="a.b.c" -->
<input onInput="inputHelper" data-name="msg" value="{{msg}}" />
```
