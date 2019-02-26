import { BasePageConfig } from './BasePage';

/**
 *
 * @param {JSON} data
 */
function JSONClone(data) {
  return JSON.parse(JSON.stringify(data));
}

/**
 *
 * @param {*} obj
 * @param {string} prop
 * @param {*} val
 * @param {boolean} [enumerable] default false
 */
function def(obj, prop, val, enumerable = false) {
  Object.defineProperty(obj, prop, {
    value: val,
    enumerable,
    writable: true,
    configurable: true,
  });
}

function logger(...args) {
  if (BasePageConfig.debug) {
    const prefix = `${new Date().toISOString()}: `;
    console.log(prefix, ...args);
  }
}

export { JSONClone, def, logger };
