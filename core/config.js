const BaseConfigs = {
  debug: true,
  keys: {
    data: 'data',
    initData: '__initData__',
    computed: '__computed__',
    constructor: 'constructor',
    onLoad: 'onLoad',
    setData: 'setData',
    updateQueue: '__update_queue__',
    forceUpdate: '$forceUpdate',
  },
  get ignoreKeys() {
    return Object.keys(this.keys).map((key) => this.keys[key]);
  },
};

export { BaseConfigs };
