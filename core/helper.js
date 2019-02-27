import { ComputedValue } from './Computed';
import { BaseConfigs } from './config';
import { def, logger } from './utils';
// eslint-disable-next-line no-unused-vars
import { BasePage } from './Base';

/**
 *
 * @param {BasePage} page
 */
function triggerComputed(page) {
  // Avoid trigger computed twice
  if (page[BaseConfigs.keys.computed]) {
    return;
  }

  // Trigger computed and calculate dependence
  def(page, BaseConfigs.keys.computed, {});

  Object.keys(page.computed).forEach((key) => {
    const currentComputed = new ComputedValue(page, key, page.computed[key]);
    ComputedValue.current = currentComputed;
    // update computed and attach to data
    currentComputed.update();
    page[BaseConfigs.keys.computed][key] = currentComputed;

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
 * @param {object} obj
 * @param {*} registerObj
 * @param {string[]} [filterKeys]
 * @param {boolean} [override]
 */
function attachFunctions(obj, registerObj, filterKeys = [], override = false) {
  // const filterKeys = BaseConfigs.ignoreKeys;
  let proto = obj;
  // Attach function recursively
  while (!proto.isPrototypeOf(Object)) {
    Object.getOwnPropertyNames(proto)
      .filter(
        (key) =>
          filterKeys.indexOf(key) === -1 && typeof obj[key] === 'function',
      )
      .forEach((key) => {
        if (!registerObj[key]) {
          registerObj[key] = obj[key];
        } else if (override) {
          registerObj[key] = obj[key];
        }
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
    page[BaseConfigs.keys.updateQueue].addUpdateData(key, newData[key]);

    // Watch
    if (typeof page.watch[key] === 'function') {
      logger('Watch update', key);
      page.watch[key].call(page, newData[key], oldData[key]);
    }
  });
}

export { triggerComputed, updateData, attachFunctions };
