const BaseConfigs = {
  debug: false,
  PROXY_KEY: '_$PROXY$_',
  keys: {
    data: 'data',
    initData: '__initData__',
    computed: '__computed__',
    updateQueue: '__update_queue__',
    forceUpdate: '$forceUpdate'
  }
}

function setConfig (config:any = {}) {
  BaseConfigs.debug = config.debug
}

export { BaseConfigs, setConfig }
