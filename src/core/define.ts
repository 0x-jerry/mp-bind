import { Base } from "./Base";

export interface RawPrototype extends Base {
  [key: string]: any;
}

export interface Prototype extends Page.PageInstance {
  [key: string]: any;
}

export interface IPropTypeMap {
  data: string[];
  /**
   * 包括 life cycle 和普通函数
   */
  method: string[];
  getter: Record<string, () => any>;
  watcher: string[];
  unobserve: string[];
}

export interface PrototypeConfig {
  type: PrototypeType;
  tpl: RawPrototype;
  propTypeMap: IPropTypeMap;
}

export enum PrototypeType {
  page = "page",
  component = "component",
}
