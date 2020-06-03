export interface RawPrototype {
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

export interface IComponentProps {
  [prop: string]: any;
}

// wx
export interface IWxComponentCtor<T extends IComponentProps = IComponentProps> {
  properties?: T;
  observers?: {
    [key: string]: Function;
  };

  behaviors?: any[];
  relations?: any[];
  externalClasses?: string[];
  options?: {
    /**
     * 在组件定义时的选项中启用多slot支持
     */
    multipleSlots?: boolean;
    /**
     * styleIsolation 选项从基础库版本 2.6.5 开始支持。它支持以下取值：
     *
     * - isolated 表示启用样式隔离，在自定义组件内外，使用 class 指定的样式将不会相互影响（一般情况下的默认值）；
     * - apply-shared 表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面；
     * - shared 表示页面 wxss 样式将影响到自定义组件，自定义组件 wxss 中指定的样式也会影响页面和其他设置了 apply-shared 或 shared 的自定义组件。（这个选项在插件中不可用。）
     */
    styleIsolation?: "isolated" | "apply-shared" | "shared";
    /**
     * 小程序基础库版本 2.2.3 以上支持 addGlobalClass 选项，
     * 即在 Component 的 options 中设置 addGlobalClass: true 。
     *
     * 这个选项等价于设置 styleIsolation: apply-shared ，但设置了 styleIsolation 选项后这个选项会失效。
     */
    addGlobalClass?: boolean;
  };

  // component lifecycle
  /**
   * 组件实例刚刚被创建好时， created 生命周期被触发。
   *
   * 此时，组件数据 this.data 就是在 Component 构造器中定义的数据 data 。
   *
   * 此时还不能调用 setData 。 通常情况下，这个生命周期只应该用于给组件 this 添加一些自定义属性字段。
   */
  created?: () => void;
  attached?: () => void;
  ready?: () => void;
  moved?: () => void;
  detached?: () => void;
  error?: (error: Error) => void;

  // page lifecycle
  show?: () => void;
  hide?: () => void;
  resize?: (size: { windowWidth: number; windowHeight: number }) => void;
}

export interface IWxPageCtor {
  route?: string;

  onLoad?: (query: { [key: string]: string }) => void;
  onShow?: () => void;
  onReady?: () => void;
  onHide?: () => void;
  onUnload?: () => void;
  onPullDownRefresh?: () => void;
  onReachBottom?: () => void;
  onPageScroll?: (opt: { scrollTop: number }) => void;
  onAddToFavorites?: (opt: {
    webviewUrl: string;
  }) => {
    title: string;
    imageUrl: string;
    /**
     * query: 'name=xxx&age=xxx',
     */
    query: string;
  };
  onShareAppMessage?: (opt: {
    from: "button" | "menu";
    target: any;
    webViewUrl: string;
  }) => {
    title: string;
    imageUrl: string;
    /**
     * 当前页面 path ，必须是以 / 开头的完整路径
     */
    path: string;
  };
  onResize?: (opt: any) => void;
  onTabItemTap?: (opt: {
    index: number;
    text: string;
    pagePath: string;
  }) => void;
}
