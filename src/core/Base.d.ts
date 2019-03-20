export class UpdateTaskQueue<T extends Base> {
  constructor(page: T);

  addUpdateData(key: string, value: any): void;

  updateData(): void;
}

export interface ITargetProxy {
  data: any;
  computed: any;
  watch: any;
  updateQueue: any;
  target: Page.PageInstance | Component.ComponentInstance & Component.ComponentOptions;
}

export interface Base {
  [key: string]: any;

  readonly _$PROXY$_: ITargetProxy;

  new (): Base;

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

}

export interface BasePage extends Base, Page.PageInstance {}

export interface BaseComponent
  extends Base,
    Component.ComponentInstance,
    Component.ComponentOptions {
}

export class BasePage {}

export class BaseComponent {}
