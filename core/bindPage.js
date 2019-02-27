import { Observer } from './Observer';
import { JSONClone, def, logger } from './utils';
// eslint-disable-next-line no-unused-vars
import { BasePage } from './Base';
import { BaseConfigs } from './config';
import { attachFunctions, triggerComputed, updateData } from './helper';

/**
 *
 * @param {BasePage} base
 */
function bindPage(base) {
  logger('register page', base);

  new Observer(base.data, (newData, oldData) => {
    updateData(base, newData, oldData);
  });

  const initData = JSONClone(base.data);
  def(base, BaseConfigs.keys.initData, initData);

  const registerObj = {
    data: initData,
    onLoad(...args) {
      base.target = this;
      const _initData = base[BaseConfigs.keys.initData];

      // Update init data, because BasePage only register once
      // So, here should update initialize data
      Object.keys(_initData).forEach((key) => {
        base.data[key] = JSONClone(_initData[key]);
      });

      // Trigger computed and calculate dependence
      triggerComputed(base);

      // onload
      base.onLoad && base.onLoad(...args);
    },
  };

  attachFunctions(base, registerObj, BaseConfigs.ignoreKeys);

  // Register Page
  Page(registerObj);
}

export { bindPage };
