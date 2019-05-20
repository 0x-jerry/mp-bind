// components/test/test.js
import { BaseComponent, bindComponent } from '../../core/index'

class Index extends BaseComponent {
  properties = {
    a: String,
    b: Number
  };

  c = 3;

  get dc () {
    return this.c * 2
  }

  $$dc (val, old) {
    console.log('computed changed', val, old)
  }

  onTap () {
    console.log(this.a, this.b, this)
    this.c++
  }

  created () {
    console.log('created', this)
  }
}

bindComponent(Index)
