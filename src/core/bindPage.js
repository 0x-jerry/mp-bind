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
    data: tpl.$data,
    ...tpl,
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

  attachFunctions(tpl, registerObj, ['constructor', 'onLoad']);

  logger('Register page', registerObj);
  // Register Page
  Page(registerObj);
}

export { bindPage };
