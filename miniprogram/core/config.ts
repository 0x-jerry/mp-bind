export const BaseConfigs = {
  debug: false,
  PROXY_KEY: "_$PROXY$_",
  keys: {
    data: "data",
    initData: "__initData__",
    computed: "__computed__",
    updateQueue: "__update_queue__",
    forceUpdate: "$forceUpdate",
  },
};

export interface IBaseConfig {
  debug: boolean;
}

export function setConfig(config: Partial<IBaseConfig> = {}) {
  BaseConfigs.debug = !!config.debug;
}
