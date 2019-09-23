# 提升小程序开发体验

> 此项目可看做微信小程序样板项目。此外，也可以单独使用 `core` 文件夹里面的核心代码，提升现有小程序开发体验

## 简单的 Demo

```js
//index.js
import { BasePage, bindPage, BaseComponent } from '../../core/index';

export class Index extends BasePage {
  // 直接定义数据，不需要放到 data 里面
  arr = [1, 2, 3];

  count = 3;

  obj = {
    deep: {
      c: 3,
    },
  };

  // 如果有大量展示数据，可用 Object.freeze 避免性能问题
  freezeObj = Object.freeze({
    test: 1
  })

  // watch obj.deep.c
  // $$ 开头的函数会自动转换成 watch 函数
  '$$obj.deep.c'(val, old) {
    this.log('obj.deep.c changed', val, old);
  }

  // watch count
  $$count(val, old) {
    this.obj.deep.c += 5;
    this.log('count changed', val, old);
  }

  // computed, 实现缓存，依赖数据更新，才会触发更新，放心使用
  get arrLength() {
    return this.arr.length;
  }

  log(name, newVal, oldVal) {
    console.log('watch', name, 'new:', newVal, 'old:', oldVal);
  }

  bindViewTap() {
    // 设置同样的值（即满足===）不会触发更新
    this.count += 1;
    this.arr.push(1);
    console.log('length', this.arrLength);
  }
}

// 以下两个函数二选一，Page 用 bindPage，component 用 bindComponent
bindPage(Index); // 页面
// bindComponent(Index) 使用组件的时候继承的是 BaseComponent
```

## 小程序开发环境

- 开发工具 - [vscode](https://code.visualstudio.com/)
- 预览工具 - [微信开发工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- vscode 插件 - [minapp](https://marketplace.visualstudio.com/items?itemName=qiu8310.minapp-vscode)

## Feature

- 更新 `data` 抛弃 `this.setData`，直接更改数据 `this.data.a = 1`
- 用 `Class` + `d.ts` 开发 `Page`，添加智能补全功能
- 引入 [JSON Schema](.vscode/settings.json#json-schema) 提升配置文件编写体验 (感谢 @qiu8310  [minapp](https://github.com/qiu8310/minapp) 项目的 `json schema`)
- 添加 [code snippets](.vscode/mp.code-snippets)
- 支持 `Watch`，类似于 `Vue` 的 `Watch`
- 支持 `Computed`，类似于 `Vue` 的 `Computed`
- 支持直接修改数组的内容

### Notice

- 不支持直接更新没有定义的数据
- 更新支持数组操作 `push, pop, shift, unshift, splice, sort, reverse`
- 支持直接更新添加的数据 `this.a = { b: 1 }` 此时修改 `this.a.b = 2` 同样有响应效果

## Todo

- [x] Component `d.ts` 引入
- [x] BaseComponent 类设计
- [ ] ~~Decorator 引入(已实现，详情看 [gulp](https://github.com/cwxyz007/wechat-mp/tree/gulp) 分支)~~
- [ ] ~~Async/Await 引入(已实现，详情看 [gulp](https://github.com/cwxyz007/wechat-mp/tree/gulp) 分支)~~