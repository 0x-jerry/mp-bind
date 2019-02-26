interface BasePage extends Page.PageInstance {
  target: Page.PageInstance;

  watch: {
    [key: string]: <T>(newVal: T, oldVal: T) => void;
  };

  computed: {
    [key: string]: <T>() => T;
  };

  /**
   * Helper function, useing in wxml file
   * update data accord to data-name attribute
   */
  inputHelper(e: any): void;

  /**
   * Helper function, useing in wxml file
   * update data accord to data-name attribute
   */
  checkboxHelper(e: any): void;

  /**
   * Force update data
   */
  $forceUpdate(): void;
}

class BasePage {}

function bindPage<T extends BasePage>(target: T): void;

export { bindPage, BasePage };
