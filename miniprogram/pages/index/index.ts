//@ts-nocheck

import { bind } from "../../core/index";

export class Index {
  todoList = [];

  todoMsg = "";

  get completeList() {
    return this.todoList.filter((todo) => todo.done);
  }

  $$todoMsg(val, oldVal) {
    console.log("todo msg changed", val, oldVal);
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

  hello() {
    console.log("hello", this);
  }

  onLoad() {
    this.hello();
    console.log("xx load", this);
  }
}

bind(new Index());
