import { BaseComponent, UpdateTaskQueue } from './Base';
import { attachFunctions, updateData, triggerComputed } from './helper';
import { Observer } from './Observer';
import { JSONClone, def, logger } from './utils';
import { BaseConfigs } from './config';

/**
 *
 * @param {InstanceType<BaseComponent>} Base
 */
function bindComponent(Base) {
  const tpl = new Base();

  const registerObj = {
    data: tpl.$data,
    properties: tpl.properties,
    methods: {},
    pageLifetimes: {},
    lifetimes: {
      attached() {
        logger('Component attached', this);
        // @ts-ignore
        const updateQueue = new UpdateTaskQueue(this);
        this.computed = {};
        this.watch = {};
        Object.keys(tpl.computed).forEach((key) => {
          this.computed[key] = tpl.computed[key].bind(this);
        });

        Object.keys(tpl.watch).forEach((key) => {
          this.watch[key] = tpl.watch[key].bind(this);
        });

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
        tpl.attached && tpl.attached.call(this);
      },
    },
  };

  const lifetimes = ['created', 'attached', 'ready', 'moved', 'detached'];

  attachFunctions(tpl, registerObj.lifetimes, [], lifetimes);

  const pageLifetimes = ['onShow', 'onHide', 'resize'];
  attachFunctions(tpl, registerObj.pageLifetimes, [], pageLifetimes);

  const exclude = pageLifetimes.concat(['constructor', 'attached']);
  attachFunctions(tpl, registerObj.methods, exclude);

  logger('Register component', registerObj);
  // Register Component
  Component(registerObj);
}

export { bindComponent };
