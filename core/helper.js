import { ComputedValue } from './Computed';
import { BaseConfigs } from './config';
import { def, logger } from './utils';

/**
 *
 * @param {import('./Base').Base} page
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
 * @param {string[]} [exclude]
 * @param {string[]} [include]
 * @param {boolean} [override]
 */
function attachFunctions(
  obj,
  registerObj,
  exclude = [],
  include = [],
  override = false,
) {
  // const filterKeys = BaseConfigs.ignoreKeys;
  let proto = obj;
  // Attach function recursively
  while (!proto.isPrototypeOf(Object)) {
    Object.getOwnPropertyNames(proto)
      .filter((key) => {
        if (typeof obj[key] !== 'function') {
          return false;
        }

        if (exclude.indexOf(key) !== -1) {
          return false;
        }

        if (include.length > 0) {
          return include.indexOf(key) !== -1;
        }

        return true;
      })
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
 * @param {import('./Base').Base} page
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
