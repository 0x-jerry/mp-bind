// components/test/test.js
/// <reference path="../../@types/index.d.ts" />
import { BaseComponent } from '../../core/index';
import { bindComponent } from '../../core/bindComponent';

class Index extends BaseComponent {
  properties = {
    a: String,
    b: Number,
  };

  data = {
    c: 3,
  };

  onTap() {
    console.log(this.data.c);
  }

  lifetimes = {
    created: () => {
      console.log('created', this);
    },
  };
}

bindComponent(new Index());
