import {
  wxPlatformConfig,
  aliPlatformConfig,
  PlatformConfig,
} from "./platform";

export interface IBaseOption {
  debug: boolean;
  platform: "ali" | "wx";
  unobserveKeys: string[];
  watchPrefix: string;
}

export interface IBaseConfig extends IBaseOption {
  readonly platformConf: PlatformConfig;
}

export enum ProxyKeys {
  PROXY = "__$PROXY$__",
  DATA = "__$DATA$__",
  OB = "__$OB$__",
}

export const configs: IBaseConfig = {
  debug: false,
  platform: "wx",
  unobserveKeys: ["frozen"],
  watchPrefix: "$$",
  get platformConf() {
    const map = {
      wx: wxPlatformConfig,
      ali: aliPlatformConfig,
    };
    return map[configs.platform];
  },
};

export function setConfig(opt: Partial<IBaseOption> = {}) {
  Object.assign(configs, opt);
}
