import { BaseConfigs } from './config';

/**
 *
 * @param {object} data
 */
function JSONClone(data) {
  return data === undefined ? undefined : JSON.parse(JSON.stringify(data));
}

/**
 *
 * @param {*} obj
 * @param {string} prop
 * @param {*} val
 * @param {boolean} [enumerable] default false
 */
function def(obj, prop, val, enumerable = false) {
  if (!isObject(obj) && typeof obj !== 'function') {
    console.warn('defineProperty should call on object', obj);
    return;
  }

  Object.defineProperty(obj, prop, {
    value: val,
    enumerable,
    writable: true,
    configurable: true,
  });
}

/**
 *
 * @param  {...any} args
 */
function logger(...args) {
  if (BaseConfigs.debug) {
    const prefix = `${new Date().toISOString()}: `;
    console.log(prefix, ...args);
  }
}

function isObject(target) {
  return typeof target === 'object' && target !== null;
}

export { JSONClone, def, logger, isObject };
