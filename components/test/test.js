// components/test/test.js
import { BaseComponent, bindComponent } from '../../core/index';

class Index extends BaseComponent {
  properties = {
    a: String,
    b: Number,
  };

  $data = {
    c: 3,
  };

  computed = {
    dc() {
      return this.$data.c * 2;
    },
  };

  onTap() {
    this.$data.a += '-';
    this.$data.b += 1;
    this.$data.c += 1;
  }

  created() {
    console.log('created', this);
  }
}

bindComponent(Index);
