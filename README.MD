# 提升小程序开发体验

> 此项目可看做微信小程序样板项目。此外，也可以单独使用 `core` 文件夹里面的核心代码，提升现有小程序开发体验

## 小程序开发环境

- 开发工具 - [vscode](https://code.visualstudio.com/)
- 预览工具 - [微信开发工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- vscode 插件 - [minapp](https://marketplace.visualstudio.com/items?itemName=qiu8310.minapp-vscode)
- 包管理器 - [yarn](https://yarnpkg.com)

## Feature

- 更新 `data` 抛弃 `this.setData`，直接更改数据 `this.data.a = 1`
- 用 `Class` + `d.ts` 开发 `Page`，添加智能补全功能
- 引入 [JSON Schema](.vscode/settings.json#json-schema) 提升配置文件编写体验 (感谢 @qiu8310  [minapp](https://github.com/qiu8310/minapp) 项目的 `json schema`)
- 添加 [snippets](.vscode/mp.code-snippets)
- 支持 `Watch`，类似于 `Vue` 的 `Watch`
- 支持 `Computed`，类似于 `Vue` 的 `Computed`

## Notice

- 不支持直接更新 `data` 中没有定义的数据
- `Watch` 暂看不支持 `deep`
- 数组暂不支持直接修改数组里面的内容

## Data 更新详情

- 数据更新支持数组操作 `push, pop, shift, unshift, splice, sort, reverse`
- data 支持直接添加数据 `data.a = {b: 1}` 此时修改 `data.a.b = 2` 同样有响应效果

## Todo

- [ ] Component `d.ts` 引入
- [ ] BaseComponent 类设计
- [ ] Decorator 引入
- [ ] Async/Await 引入

## Data Update Flow

1. script start
2. `data.a.b = 2` => update self data => push to micro task - update `a.b = 2`, wait update
3. `data.a.c = 3` => update self data => push to micro task - update `a.c = 3`, wait udpate
4. script end
5. micro task begin
6. use `setData` update `a.b = 2` & `a.c = 3`
7. micro task end
8. macro task ...

## Dev

核心源代码在 `core` 文件夹里面

核心思想：利用 `BasePage` 类代理微信中用 `Page(Object object)` 函数注册后的对象
