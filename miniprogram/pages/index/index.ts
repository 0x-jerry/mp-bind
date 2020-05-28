import { bind, BasePage } from "../../core/index";

interface ITodo {
  id: string | number
  msg: string
  done: boolean
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

  get total() {
    return this.todoList.length;
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

  onLoad() {
    console.log('Todo app loaded')
  }
}

bind(new Index());
