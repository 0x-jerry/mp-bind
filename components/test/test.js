// components/test/test.js
/// <reference path="../../@types/index.d.ts" />

Component({
  /**
   * Component properties
   */
  properties: {
    a: String,
    b: Number,
  },

  /**
   * Component initial data
   */
  data: {},

  /**
   * Component methods
   */
  methods: {},

  lifetimes: {
    attached() {
      console.log(this);
    },
  },
});
