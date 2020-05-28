# 小程序数据绑定库

提升小程序开发体验的工具库

## 功能

- 更新 `data` 抛弃 `this.setData`，直接更改数据 `this.data.a = 1`
- 支持 `Watch`，类似于 `Vue` 的 `Watch`
- 支持 `Computed`，类似于 `Vue` 的 `Computed`
- 支持直接修改数组的内容

## Demo

查看 `src/pages/index`

### Notice

- 不支持直接更新没有定义的数据
- 更新支持数组操作 `push, pop, shift, unshift, splice, sort, reverse`
- 支持直接更新添加的数据 `this.a = { b: 1 }` 此时修改 `this.a.b = 2` 同样有响应效果
