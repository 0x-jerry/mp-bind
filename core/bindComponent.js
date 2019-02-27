// eslint-disable-next-line no-unused-vars
import { BaseComponent } from './Base';
import { attachFunctions, updateData, triggerComputed } from './helper';
import { Observer } from './Observer';
import { JSONClone, def, logger } from './utils';
import { BaseConfigs } from './config';

/**
 *
 * @param {BaseComponent} base
 */
function bindComponent(base) {
  logger('register component', base);

  new Observer(base.data, (newData, oldData) => {
    updateData(base, newData, oldData);
  });

  const initData = JSONClone(base.data);
  def(base, BaseConfigs.keys.initData, initData);

  const registerObj = {
    properties: base.properties,
    data: initData,
    methods: {},
    pageLifetimes: {},
    lifetimes: {
      attached() {
        console.log('bind', base.target, base.target === this);
        base.target = this;
        const _initData = base[BaseConfigs.keys.initData];

        // Update init data, because BasePage only register once
        // So, here should update initialize data
        Object.keys(_initData).forEach((key) => {
          base.data[key] = JSONClone(_initData[key]);
        });

        // Trigger computed and calculate dependence
        triggerComputed(base);

        // attached
        base.lifetimes && base.lifetimes.attached && base.lifetimes.attached();
      },
    },
  };

  if (base.lifetimes) {
    attachFunctions(base.lifetimes, registerObj.lifetimes);
  }

  if (base.pageLifetimes) {
    attachFunctions(base.pageLifetimes, registerObj.pageLifetimes);
  }

  attachFunctions(base, registerObj.methods);

  // Register Component
  Component(registerObj);
  console.log(registerObj);
}

export { bindComponent };
