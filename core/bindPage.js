import { Observer } from './Observer';
import { JSONClone, def } from './utils';
import { ComputedValue } from './Computed';
// eslint-disable-next-line no-unused-vars
import { BasePageConfig, BasePage } from './BasePage';

/**
 *
 * @param {BasePage} target
 */
function bindPage(target) {
  new Observer(target.data, (newData, oldData) => {
    // Update sync, both target.data.xxx and target.target.data.xxx are updated
    // target.target.setData(arg);

    Object.keys(newData).forEach((key) => {
      /**
       * update merge test (update in micro task)
       * notice： target.data.xxx is update sync
       *          but, target.target.data.xxx not update
       *          it will update in micro task, one solution is use `setTimeout(() => data.xxx)`
       *          if you want update sync, use target.setData
       */
      target[BasePageConfig.keys.updateQueue].addUpdateData(key, newData[key]);

      // Watch
      if (typeof target.watch[key] === 'function') {
        target.watch[key](newData[key], oldData[key]);
      }
    });
  });

  const initData = JSONClone(target.data);
  def(target, BasePageConfig.keys.initData, initData);

  const registerObj = {
    data: initData,
    onLoad(...args) {
      target.target = this;
      const _initData = target[BasePageConfig.keys.initData];

      // Update init data
      Object.keys(_initData).forEach((key) => {
        target.data[key] = JSONClone(_initData[key]);
      });

      // Trigger computed and attach computed to data
      Object.keys(target.computed).forEach((key) => {
        const currentComputed = new ComputedValue(
          target,
          key,
          target.computed[key],
        );
        ComputedValue.current = currentComputed;
        currentComputed.update();
        def(target.computed[key], '__computed__', currentComputed);
      });
      ComputedValue.current = null;

      // onload
      target.onLoad && target.onLoad(...args);
    },
  };

  const filterKeys = BasePageConfig.ignoreKeys;

  let proto = target;
  while (!proto.isPrototypeOf(Object)) {
    Object.getOwnPropertyNames(proto)
      .filter(
        (key) =>
          filterKeys.indexOf(key) === -1 && typeof target[key] === 'function',
      )
      .forEach((key) => {
        registerObj[key] = (...args) => target[key](...args);
      });

    proto = Object.getPrototypeOf(proto);
  }
  Page(registerObj);
}

export { bindPage };
