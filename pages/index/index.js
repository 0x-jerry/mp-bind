//index.js
import { BasePage, bindPage } from '../../core/index';

export class Index extends BasePage {
  $data = {
    arr: [1, 2, 3],
    deep: {
      a: 1,
    },
    count: 11,
  };

  watch = {
    count(newVal, oldVal) {
      console.log(this, newVal, oldVal);
    },
  };

  computed = {
    arrLength() {
      return this.$data.arr.length;
    },
    fistArr() {
      const arr = this.$data.arr;
      return (arr && arr[1]) || 'default';
    },
  };

  log(name, newVal, oldVal) {
    console.log('watch', name, 'new:', newVal, 'old:', oldVal);
  }

  bindViewTap() {
    // this.data.arr = [1, 2, 3, 4];
    this.$data.arr[0] = 5;
    this.$data.arr.push(44);
    this.$data.arr.push(55);
  }

  onLoad() {
    console.log('loaded', this);
  }
}

bindPage(Index);
