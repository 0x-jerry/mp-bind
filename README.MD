# 提升小程序开发体验

## Feature

- 更新 `data` 抛弃 `this.setData`，直接更改数据 `this.data.a = 1`
- 用 `Class` + `d.ts` 开发 `Page`，提升开发体验
- 引入 [JSON Schema](.vscode/settings.json#json-schema) 提升配置文件编写体验 (感谢 @qiu8310  [minapp](https://github.com/qiu8310/minapp) 项目的 `json schema`)
- 添加 [snippets](.vscode/mp.code-snippets)
- 支持 `Watch` data 里面的数据

## Data 更新详情

- 数据更新支持数组操作 `push, pop, shift, unshift, splice, sort, reverse`
- data 支持直接添加数据 `data.a = {b: 1}` 此时修改 `data.a.b = 2` 同样有响应效果

## Todo

- [ ] Component `d.ts` 引入
- [ ] BaseComponent 类设计
- [ ] decrator 引入

## Data Update Flow

1. script start
2. `data.a.b = 2` => update self data => push to micro task - update `a.b = 2`, wait update
3. `data.a.c = 3` => update self data => push to micro task - update `a.c = 3`, wait udpate
4. script end
5. micro task begin
6. use `setData` update `a.b = 2` & `a.c = 3`
7. micro task end
8. macro task ...
