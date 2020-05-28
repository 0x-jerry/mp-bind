import { bind, BasePage } from "../../core/index";

interface ITodo {
  id: string | number;
  msg: string;
  done: boolean;
}

export class Index extends BasePage {
  todoList: ITodo[] = [
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
  $$todoMsg(newVal: string, oldVal: string) {
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

  remove(e: any) {
    const id = e.target.dataset.id;
    const idx = this.todoList.findIndex((todo) => todo.id === id);

    if (idx >= 0) {
      this.todoList.splice(idx, 1);
    }
  }

  switch(e: any) {
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
