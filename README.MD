# 提升小程序开发体验

## Feature

- 更新 `data` 抛弃 `this.setData`，直接更改数据 `this.data.a = 1`
- 用 `Class` + `d.ts` 开发 `Page`，提升开发体验
- 引入 [JSON Schema](.vscode/settings.json#json-schema) 提升配置文件编写体验
- 添加 [snippets](.vscode/mp.code-snippets)

## Data 更新详情

- 数据更新支持数组操作 `push, pop, shift, unshift, splice, sort, reverse`
- data 支持直接添加数据 `data.a = {b: 1}` 此时修改 `data.a.b = 2` 同样有响应效果

## Todo

- [ ] Component `d.ts` 引入
- [ ] BaseComponent 类设计
- [ ] decrator 引入
