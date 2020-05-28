export const BaseConfigs: IBaseConfig = {
  debug: false,
  platform: "wx",
};

export enum ProxyKeys {
  PROXY = "__$PROXY$__",
  DATA = "__$DATA$__",
  OB = "__$OB$__",
}

export interface IBaseConfig {
  debug: boolean;
  platform: "ali" | "wx";
}

export function setConfig(config: Partial<IBaseConfig> = {}) {
  BaseConfigs.debug = !!config.debug;
}
