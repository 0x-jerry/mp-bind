// components/test/test.js
import { BaseComponent } from '../../core/index';
import { bindComponent } from '../../core/bindComponent';

class Index extends BaseComponent {
  properties = {
    a: String,
    b: Number,
  };

  $data = {
    c: 3,
  };

  computed = {
    dc(){
      return this.$data.c * 2;
    }
  }

  onTap() {
    this.$data.c = 44;
    this.$data.a = 55;
    console.log(this.$data.c);
  }

  created() {
    console.log('created', this);
  }
}

bindComponent(Index);
