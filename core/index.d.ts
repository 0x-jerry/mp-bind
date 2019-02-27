interface Base {
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

interface BasePage extends Base, Page.PageInstance {
  target: Page.PageInstance;
}

interface BaseComponent
  extends Base,
    Component.ComponentInstance,
    Component.ComponentOptions {

  target: Component.ComponentInstance;
}

class BasePage {}

class BaseComponent {}

function bindPage<T extends BasePage>(target: T): void;

function bindComponent<T extends BaseComponent>(target: T): void;

export { bindPage, BasePage, bindComponent, BaseComponent };
