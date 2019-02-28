import { BasePage, BaseComponent } from './Base';

declare function bindPage<T extends BasePage>(target: InstanceType<T>): void;

declare function bindComponent<T extends BaseComponent>(
  target: InstanceType<T>,
): void;

export { bindPage, BasePage, bindComponent, BaseComponent };
