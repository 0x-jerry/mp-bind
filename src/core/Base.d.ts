export class UpdateTaskQueue<T extends Base> {
  constructor(page: T);

  addUpdateData(key: string, value: any): void;

  updateData(): void;
}

export interface Base {
  new (): Base;

  [key: string]: any;

  // readonly $$data$$?: {
  //   [key: string]: any;
  // };

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

export interface BasePage extends Base, Page.PageInstance {
}

export interface BaseComponent
  extends Base,
    Component.ComponentInstance,
    Component.ComponentOptions {
  watch?: {
    [key: string]: <T>(newVal: T, oldVal: T) => void;
  };

  computed?: {
    [key: string]: () => any;
  };
}

export class BasePage {}

export class BaseComponent {}
