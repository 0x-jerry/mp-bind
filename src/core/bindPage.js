import { Observer } from './Observer';
import { logger, def, JSONClone } from './utils';
import { BasePage, UpdateTaskQueue } from './Base';
import { BaseConfigs } from './config';
import { attachFunctions, triggerComputed, updateData } from './helper';

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

      this.$data = JSONClone(this.data);
      new Observer(this.$data, (newData, oldData) => {
        // @ts-ignore
        updateData(this, newData, oldData);
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
    Object.keys(proto).forEach((key) => {
      const value = tpl[key];
      if (typeof value === 'function') {
        // is watch
        if (/^\$\$/.test(key)) {
          registerObj.watch[key.slice(2)] = value;
        } else {
          registerObj[key] = value;
        }
      } else {
        registerObj.data[key] = value;
      }
    });

    Object.getOwnPropertyNames(proto).filter((key) => {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc.get) {
        registerObj.computed[key] = desc.get;
      }
    });

    proto = Object.getPrototypeOf(proto);
  }

  //--------------------------------
  // const registerObj = {
  //   data: tpl.$data,
  //   ...tpl,
  //   onLoad(...args) {
  //     logger('Page loaded', this);
  //     if (BaseConfigs.debug) {
  //       global.page = this;
  //     }

  //     // @ts-ignore
  //     const updateQueue = new UpdateTaskQueue(this);
  //     def(this, BaseConfigs.keys.updateQueue, updateQueue);
  //     def(this, BaseConfigs.keys.forceUpdate, () => updateQueue.updateData);

  //     this.$data = JSONClone(this.data);
  //     new Observer(this.$data, (newData, oldData) => {
  //       // @ts-ignore
  //       updateData(this, newData, oldData);
  //     });

  //     // Trigger computed and calculate dependence
  //     // @ts-ignore
  //     triggerComputed(this);

  //     // onload
  //     tpl.onLoad && tpl.onLoad.call(this, args);
  //   },
  // };

  // attachFunctions(tpl, registerObj, ['constructor', 'onLoad']);

  logger('Register page', registerObj);
  // Register Page
  Page(registerObj);
}

export { bindPage };
