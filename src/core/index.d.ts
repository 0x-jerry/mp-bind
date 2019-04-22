import { BasePage, BaseComponent } from './Base';

declare function bindPage<T extends BasePage>(target: InstanceType<T>): void;

declare function bindComponent<T extends BaseComponent>(target: InstanceType<T>): void;

export interface IConfigOptions {
  debug?: boolean;
}

export function setConfig(config: IConfigOptions): void;

export { bindPage, BasePage, bindComponent, BaseComponent };
