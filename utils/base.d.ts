interface BasePage extends Page.PageInstance {
  target: Page.PageInstance;
}

class BasePage {}

function bindPage<T extends BasePage>(target: T): void;

export { bindPage, BasePage };
