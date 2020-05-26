export const BaseConfigs = {
  debug: true,
};

export enum ProxyKeys {
  PROXY = '__$PROXY$__'
}

export interface IBaseConfig {
  debug: boolean;
}

export function setConfig(config: Partial<IBaseConfig> = {}) {
  BaseConfigs.debug = !!config.debug;
}
