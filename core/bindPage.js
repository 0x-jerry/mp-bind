import { Observer } from './Observer';
import { JSONClone, def } from './utils';
import { ComputedValue } from './Computed';
// eslint-disable-next-line no-unused-vars
import { BasePageConfig, BasePage } from './BasePage';

/**
 *
 * @param {BasePage} page
 */
function triggerComputed(page) {
  // Trigger computed and calculate dependence
  def(page, BasePageConfig.keys.computed, {});

  Object.keys(page.computed).forEach((key) => {
    const currentComputed = new ComputedValue(page, key, page.computed[key]);
    ComputedValue.current = currentComputed;
    // update computed and attach to data
    currentComputed.update();
    page[BasePageConfig.keys.computed][key] = currentComputed;

    Object.defineProperty(page.computed, key, {
      get: () => {
        return currentComputed.value;
      },
      configurable: true,
      enumerable: true,
    });
  });

  ComputedValue.current = null;
}

/**
 *
 * @param {BasePage} page
 * @param {*} registerObj
 */
function attachFunctions(page, registerObj) {
  const filterKeys = BasePageConfig.ignoreKeys;
  let proto = page;
  // Attach function recursively
  while (!proto.isPrototypeOf(Object)) {
    Object.getOwnPropertyNames(proto)
      .filter(
        (key) =>
          filterKeys.indexOf(key) === -1 && typeof page[key] === 'function',
      )
      .forEach((key) => {
        registerObj[key] = (...args) => page[key](...args);
      });

    proto = Object.getPrototypeOf(proto);
  }
}

/**
 *
 * @param {BasePage} page
 * @param {*} newData
 * @param {*} oldData
 */
function updateData(page, newData, oldData) {
  Object.keys(newData).forEach((key) => {
    // Use update task queue to update data in micro task
    page[BasePageConfig.keys.updateQueue].addUpdateData(key, newData[key]);

    // Watch
    if (typeof page.watch[key] === 'function') {
      page.watch[key](newData[key], oldData[key]);
    }
  });
}

/**
 *
 * @param {BasePage} target
 */
function bindPage(target) {
  new Observer(target.data, (newData, oldData) => {
    updateData(target, newData, oldData);
  });

  const initData = JSONClone(target.data);
  def(target, BasePageConfig.keys.initData, initData);

  const registerObj = {
    data: initData,
    onLoad(...args) {
      target.target = this;
      const _initData = target[BasePageConfig.keys.initData];

      // Update init data, because BasePage only register once
      // So, here should update initialize data
      Object.keys(_initData).forEach((key) => {
        target.data[key] = JSONClone(_initData[key]);
      });

      // Trigger computed and calculate dependence
      triggerComputed(target);

      // onload
      target.onLoad && target.onLoad(...args);
    },
  };

  attachFunctions(target, registerObj);

  // Register Page
  Page(registerObj);
}

export { bindPage };
