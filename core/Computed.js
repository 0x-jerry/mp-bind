class ComputedValue {
  static current = null;
  static all = [];

  /**
   *
   * @param {BasePage} page
   * @param {string} name
   * @param {() => any} getFunc
   */
  constructor(page, name, getFunc) {
    this.page = page;
    this.get = getFunc;
    this.name = name;
    ComputedValue.all.push(this);
  }

  update() {
    this.value = this.get();

    this.page['__update_queue__'].addUpdateData(this.name, this.value);
  }
}

export { ComputedValue };
