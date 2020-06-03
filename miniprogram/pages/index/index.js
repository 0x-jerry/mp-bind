import { bind, Base } from "../../mp-bind/bind.cjs";

export class Index extends Base {
  todoList = [
    {
      id: 1,
      msg: "todo",
      done: false,
    },
    {
      id: 2,
      msg: "complete todo",
      done: true,
    },
  ];
  todoMsg = "";
  hideComplete = false;

  // 保留字段，没有响应式效果
  frozen = {
    reactive: false,
  };

  // freeze 对象也没有响应式效果
  freeze = Object.freeze([1]);

  // getter， 处理方式类似 vue 的 computed
  get total() {
    return this.todoList.length;
  }

  get showTodo() {
    return this.todoList.filter((todo) =>
      this.hideComplete ? !todo.done : true
    );
  }

  // watch, 监听 todoMsg，每当 todoMsg 更改，会触发此函数
  $$todoMsg(newVal, oldVal) {
    console.log("todo msg update:", newVal, oldVal);
  }

  add() {
    const todo = {
      id: Math.random().toString(16).substr(2),
      msg: this.todoMsg,
      done: false,
    };

    this.todoList.push(todo);
  }

  remove(e) {
    const id = e.target.dataset.id;
    const idx = this.todoList.findIndex((todo) => todo.id === id);

    if (idx >= 0) {
      this.todoList.splice(idx, 1);
    }
  }

  switch(e) {
    const id = e.target.dataset.id;
    const todo = this.todoList.find((todo) => todo.id === id);

    if (todo) {
      todo.done = !todo.done;
    }
  }

  switchHide() {
    this.hideComplete = !this.hideComplete;
  }

  onLoad() {
    console.log("Todo app loaded");
  }
}

bind(new Index());
