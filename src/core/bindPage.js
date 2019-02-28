import { Observer } from './Observer';
import { logger, def, JSONClone } from './utils';
import { BasePage, UpdateTaskQueue } from './Base';
import { BaseConfigs } from './config';
import { triggerComputed, updateData } from './helper';

/**
 *
 * @param {BasePage} Base
 */
function bindPage(Base) {
  const tpl = new Base();

  const registerObj = {
    data: {},
    computed: {},
    watch: {},
    /**
     * @param {any[]} args
     */
    onLoad(...args) {
      logger('Page loaded', this);
      if (BaseConfigs.debug) {
        global.page = this;
      }

      // @ts-ignore
      const updateQueue = new UpdateTaskQueue(this);
      def(this, BaseConfigs.keys.updateQueue, updateQueue);
      def(this, BaseConfigs.keys.forceUpdate, () => updateQueue.updateData);

      def(this, '$$data$$', JSONClone(this.data));
      new Observer(this.$$data$$, (newData, oldData) => {
        // @ts-ignore
        updateData(this, newData, oldData);
      });

      // Proxy observed data
      Object.keys(this.data).forEach((key) => {
        Object.defineProperty(this, key, {
          get: () => {
            return this.$$data$$[key];
          },
          set: (val) => {
            this.$$data$$[key] = val;
          },
          configurable: true,
          enumerable: true,
        });
      });

      // Trigger computed and calculate dependence
      // @ts-ignore
      triggerComputed(this);

      // onload
      tpl.onLoad && tpl.onLoad.call(this, args);
    },
  };

  let proto = tpl;

  while (!proto.isPrototypeOf(Object)) {
    Object.getOwnPropertyNames(proto)
      .filter((key) => {
        const filterKeys = ['constructor', 'onLoad', 'watch', 'computed'];
        return filterKeys.indexOf(key) === -1;
      })
      .forEach((key) => {
        const desc = Object.getOwnPropertyDescriptor(proto, key);

        // is computed
        // ! Hack, do not read getter before onLoad
        if (desc && desc.get) {
          registerObj.computed[key] = desc.get;
        } else if (typeof tpl[key] === 'function') {
          // is watch
          if (/^\$\$/.test(key)) {
            registerObj.watch[key.slice(2)] = tpl[key];
            // function
          } else {
            registerObj[key] = tpl[key];
          }
        } else {
          registerObj.data[key] = tpl[key];
        }
      });

    proto = Object.getPrototypeOf(proto);
  }

  logger('Register page', registerObj);
  // Register Page
  Page(registerObj);
}

export { bindPage };
