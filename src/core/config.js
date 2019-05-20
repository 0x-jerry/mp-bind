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

/**
 *
 * @param {import('./index').IConfigOptions} config
 */
function setConfig (config = {}) {
  BaseConfigs.debug = config.debug
}

export { BaseConfigs, setConfig }
