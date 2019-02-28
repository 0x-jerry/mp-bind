import { ComputedValue } from './Computed';
import { def, logger } from './utils';
import { BasePage } from './index';
import { BaseConfigs } from './config';

/**
 *
 * @param {BasePage} base
 */
function triggerComputed(base) {
  const proxyObj = base[BaseConfigs.PROXY_KEY];

  def(proxyObj, '__computed__', {});

  logger('Trigger computed', proxyObj);

  // Trigger computed and calculate dependence
  Object.keys(proxyObj.computed).forEach((key) => {
    const currentComputed = new ComputedValue(
      proxyObj,
      key,
      proxyObj.computed[key].bind(base),
    );
    ComputedValue.current = currentComputed;
    // update computed and attach to data
    currentComputed.update();

    proxyObj['__computed__'][key] = currentComputed;

    // proxy computed
    Object.defineProperty(base, key, {
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
 * @param {*} newData
 * @param {*} oldData
 */
function updateData(proxyObj, newData, oldData) {
  Object.keys(newData).forEach((key) => {
    // Use update task queue to update data in micro task
    proxyObj.updateQueue.addUpdateData(key, newData[key]);

    // Watch
    if (typeof proxyObj.watch[key] === 'function') {
      logger('Watch update', key);
      proxyObj.watch[key](newData[key], oldData[key]);
    }
  });
}

export { triggerComputed, updateData, attachFunctions };
