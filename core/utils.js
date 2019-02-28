import { BaseConfigs } from './config';

/**
 *
 * @param {JSON} data
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
  if (typeof obj !== 'object' && typeof obj !== 'function') {
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

export { JSONClone, def, logger };
