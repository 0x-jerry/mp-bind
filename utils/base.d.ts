interface BasePage extends Page.PageInstance {
  target: Page.PageInstance;

  /**
   * Helper function, useing in wxml file
   * update data accord to data-name attribute
   */
  inputHelper(e: any): void;

  /**
   * Helper function, useing in wxml file
   * update data accord to data-name attribute
   */
  checkboxHelper(e: any) :void;
}

class BasePage {}

function bindPage<T extends BasePage>(target: T): void;

export { bindPage, BasePage };
