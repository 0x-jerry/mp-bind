# 小程序数据绑定库

提升小程序开发体验的工具库

## 功能

1. 更改页面定义方式，使用类的形式，更方便编辑器提示

```js
// app.js
// 默认微信小程序，如果是阿里小程序，请设置 `ali`，只需要在 app.js 中设置一次即可。
setConfig({ platform: "ali" });

// index.js
import { BasePage, setConfig, bind } from "mp-bind";

export class IndexPage extends BasePage {
  hideDone = false;
  todos = [];
  todoMsg = "";

  // getter 会自动更新到视图页面
  get hideText() {
    return this.hideDone ? "显示" : "隐藏";
  }

  get notComplete() {
    return this.todos.filter((todo) => !todo.done);
  }

  get todoList() {
    return this.hideDone ? this.notComplete : this.todos;
  }

  get todoInfo() {
    return `${this.todos.length}`;
  }
}

bind(new IndexPage());
```

之前

```js
// old.js
Page({
  data: {
    hideDone: false,
    todos: [],
    todoMsg: "",
    hideText: "隐藏",
    notComplete: [],
    showTodo: [],
    todoInfo: "0/0",
  },
});
```

2. 定义方法或者生命周期

```js
// index.js
import { BasePage, setConfig, bind } from "mp-bind";

export class IndexPage extends BasePage {
  hideDone = false;
  todos = [];
  todoMsg = "";

  // getter 会自动更新到视图页面
  get hideText() {
    return this.hideDone ? "显示" : "隐藏";
  }

  get notComplete() {
    return this.todos.filter((todo) => !todo.done);
  }

  get todoList() {
    return this.hideDone ? this.notComplete : this.todos;
  }

  get todoInfo() {
    return `${this.todos.length}`;
  }

  // 定义方法
  addTodo() {
    const todo = {
      id: uid(),
      msg: this.todoMsg,
      isDone: false,
    };

    this.todos.push(todo);
  }

  deleteTodo(e) {
    const id = e.target.dataset.todoId;
    const idx = this.todos.findIndex((todo) => todo.id === id);

    if (idx >= 0) {
      this.todos.splice(idx, 1);
    }
  }

  switchTodo(e) {
    const id = e.target.dataset.todoId;
    const todo = this.todos.find((todo) => todo.id === id);
    if (todo) {
      todo.isDone = !todo.isDone;
    }
  }

  switchHideDone() {
    this.hideDone = !this.hideDone;
  }

  // 定义生命周期
  onLoad(arg) {
    console.log("Page loaded", arg);
  }
}

bind(new IndexPage());
```

之前：

```js
Page({
  data: {
    hideDone: false,
    todos: [],
    todoMsg: "",
    hideText: "隐藏",
    notComplete: [],
    showTodo: [],
    todoInfo: "0/0",
  },
  // 定义方法
  addTodo() {
    const todo = {
      id: uid(),
      msg: this.todoMsg,
      isDone: false,
    };
    this.todos.push(todo);
  },
  deleteTodo(e) {
    const id = e.target.dataset.todoId;
    const idx = this.todos.findIndex((todo) => todo.id === id);

    if (idx >= 0) {
      this.todos.splice(idx, 1);
    }
  },
  switchTodo(e) {
    const id = e.target.dataset.todoId;
    const todo = this.todos.find((todo) => todo.id === id);
    if (todo) {
      todo.isDone = !todo.isDone;
    }
  },
  switchHideDone() {
    this.hideDone = !this.hideDone;
  },
  // 定义生命周期
  onLoad(arg) {
    console.log("Page loaded", arg);
  },
});
```

3. 直接修改数据，抛弃 setData

```js
```

### Notice

- 不支持直接更新没有定义的数据
- 更新支持数组操作 `push, pop, shift, unshift, splice, sort, reverse`
- 支持直接更新添加的数据 `this.a = { b: 1 }` 此时修改 `this.a.b = 2` 同样有响应效果
