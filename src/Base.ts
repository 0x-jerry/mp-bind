import { logger } from "./Logger";

export class Base {
  /**
   * update data accord to attribute `data-name`
   * support `a.b.c` syntax
   */
  inputHelper(e: {
    currentTarget: { dataset: { name: string } };
    detail: { value: any };
  }) {
    const names = e.currentTarget.dataset.name.split(".");
    const value = e.detail.value;

    logger.log("input helper", names, value);

    let data: any = this;
    try {
      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        if (i === names.length - 1) {
          data[name] = value;
        } else {
          data = data[name];
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }
}

export interface BasePage extends Base {
  onLoad?: (query: { [key: string]: string }) => void;
  onShow?: () => void;
  onReady?: () => void;
  onHide?: () => void;
  onUnload?: () => void;
  onTitleClick?: () => void;
  onOptionMenuClick?: () => void;
  onPullDownRefresh?: (opt: { from: any }) => void;
  onPageScroll?: (opt: { scrollTop: number }) => void;
  onReachBottom?: () => void;
  onShareAppMessage?: (opt: any) => void;
}

export interface IComponentProps {
  [prop: string]: any;
}

export interface BaseComponent<T extends IComponentProps = IComponentProps> extends Base {
  props?: T;
  onInit?: () => void;
  deriveDataFromProps?: (nextProps: T) => void;
  didMount?: () => void;
  didUpdate?: (props: T, data: any) => void;
  didUnmount?: () => void;
}
