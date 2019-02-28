/// <reference path="./utils.d.ts" />

declare namespace Component {
  type propertyTypes = any;

  interface IProperty {
    /**类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型） */
    type: propertyTypes;
    /**属性初始值（可选），如果未指定则会根据类型选择一个 */
    value?: any;
    /**
     * 属性被改变时执行的函数（可选），通常 newVal 就是新设置的数据， oldVal 是旧数
     * 新版本基础库不推荐使用这个字段，而是使用 Component 构造器的 observer 字段代替（这样会有更强的功能和更好的性能）
     */
    observer?: <T>(newVal: T, oldVal: T) => void;
  }

  interface ComponentOptions {
    /**
     * 可直接设置类型，目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
     *
     * 注意：在 properties 定义段中，属性名采用驼峰写法（propertyName）
     * 在 wxml 中，指定属性值时则对应使用连字符写法（component-tag-name property-name="attr value"）
     * 应用于数据绑定时采用驼峰写法（attr="{{propertyName}}"）
     *
     */
    properties?:
      | {
          [key: string]: IProperty;
        }
      | any;

    /** 页面的初始数据
     *
     * `data` 是页面第一次渲染使用的**初始数据**。
     *
     * 页面加载时，`data` 将会以`JSON`字符串的形式由逻辑层传至渲染层，因此`data`中的数据必须是可以转成`JSON`的类型：字符串，数字，布尔值，对象，数组。
     *
     * 渲染层可以通过 `WXML` 对数据进行绑定。
     */
    data?: IAnyObject;

    /**组件数据字段监听器，用于监听 properties 和 data 的变化，参见 数据监听器 */
    observers?: {
      [key: string]: (...data: any[]) => void;
    };

    /**组件的方法，包括事件响应函数和任意的自定义方法 */
    methods?: {
      [key: string]: (...args: any[]) => any;
    };

    /**类似于mixins和traits的组件间代码复用机制 */
    behaviors?: string[];

    /**
     * 组件生命周期函数，在组件实例刚刚被创建时执行，注意此时不能调用 setData
     */
    created?(): void;

    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行
     */
    attached?(): void;

    /**
     * 组件生命周期函数，在组件布局完成后执行
     */
    ready?(): void;

    /**
     * 组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
     */
    moved?(): void;

    /**
     * 组件生命周期函数，在组件实例被从页面节点树移除时执行
     */
    detached?(): void;

    options?: {
      /**激活全局样式 */
      addGlobalClass: boolean;
    };

    lifetimes?: {
      /**组件生命周期函数，在组件实例刚刚被创建时执行，注意此时不能调用 setData */
      created?(): void;

      /**组件生命周期函数，在组件实例进入页面节点树时执行 */
      attached?(): void;

      /**组件生命周期函数，在组件布局完成后执行 */
      ready?(): void;

      /**组件生命周期函数，在组件实例被移动到节点树另一个位置时执行 */
      moved?(): void;

      /**组件生命周期函数，在组件实例被从页面节点树移除时执行 */
      detached?(): void;
    };

    /** 生命周期回调—监听页面显示
     *
     * 页面显示/切入前台时触发。
     */
    onShow?(): void;
    /** 生命周期回调—监听页面隐藏
     *
     * 页面隐藏/切入后台时触发。 如 `navigateTo` 或底部 `tab` 切换到其他页面，小程序切入后台等。
     */
    onHide?(): void;

    /**组件所在的页面尺寸变化时执行 */
    resize?(size: any): void;

    /**
     * 组件所在页面的生命周期声明对象
     */
    pageLifetimes: {
      /** 生命周期回调—监听页面显示
       *
       * 页面显示/切入前台时触发。
       */
      onShow?(): void;
      /** 生命周期回调—监听页面隐藏
       *
       * 页面隐藏/切入后台时触发。 如 `navigateTo` 或底部 `tab` 切换到其他页面，小程序切入后台等。
       */
      onHide?(): void;

      /**组件所在的页面尺寸变化时执行 */
      resize?(size: any): void;
    };
  }

  interface ComponentInstance {
    /**组件的文件路径 */
    is: string;

    /**节点 id*/
    id: string;

    /**节点 dataset*/
    dataset: string;

    /** `setData` 函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的 `this.data` 的值（同步）。
     *
     * **注意：**
     *
     * 1. **直接修改 this.data 而不调用 this.setData 是无法改变页面的状态的，还会造成数据不一致**。
     * 1. 仅支持设置可 JSON 化的数据。
     * 1. 单次设置的数据不能超过1024kB，请尽量避免一次设置过多的数据。
     * 1. 请不要把 data 中任何一项的 value 设为 `undefined` ，否则这一项将不被设置并可能遗留一些潜在问题。
     */

    setData?(
      /** 这次要改变的数据
       *
       * 以 `key: value` 的形式表示，将 `this.data` 中的 `key` 对应的值改变成 `value`。
       *
       * 其中 `key` 可以以数据路径的形式给出，支持改变数组中的某一项或对象的某个属性，如 `array[2].message`，`a.b.c.d`，并且不需要在 this.data 中预先定义。
       */
      data: IAnyObject,
      /** setData引起的界面更新渲染完毕后的回调函数，最低基础库： `1.5.0` */
      callback?: () => void,
    ): void;

    /**检查组件是否具有 behavior （检查时会递归检查被直接或间接引入的所有behavior） */
    hasBehavior?: () => boolean;

    /**触发事件 */
    triggerEvent?(name: string, detail: IAnyObject, options: IAnyObject): void;

    [key: string]: any;
  }

  interface ComponentConstructor extends ComponentOptions {
    (options: ComponentOptions): ComponentInstance;
  }
}

declare const Component: Component.ComponentConstructor;
