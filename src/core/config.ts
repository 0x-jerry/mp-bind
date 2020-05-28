export const BaseConfigs = {
  debug: false,
};

export enum ProxyKeys {
  PROXY = '__$PROXY$__',
  DATA = '__$DATA$__',
  OB = '__$OB$__'
}

export interface IBaseConfig {
  debug: boolean;
}

export function setConfig(config: Partial<IBaseConfig> = {}) {
  BaseConfigs.debug = !!config.debug;
}
