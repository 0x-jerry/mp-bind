export interface IBaseOption {
  debug: boolean;
  platform: "ali" | "wx";
}

export interface IBaseConfig extends IBaseOption {
  unobserveKeys: string[];
  readonly platformConf: PlatformConfig;
}

interface PlatformConfig {
  page: {
    ctor: any;
  };
  component: {
    ctor: any;
  };
}

export enum ProxyKeys {
  PROXY = "__$PROXY$__",
  DATA = "__$DATA$__",
  OB = "__$OB$__",
}

const wxPlatformConfig: PlatformConfig = {
  page: {
    ctor: Page,
  },
  component: {
    // @ts-ignore
    ctor: Component,
  },
};

const aliPlatformConfig: PlatformConfig = {
  page: {
    ctor: Page,
  },
  component: {
    // @ts-ignore
    ctor: Component,
  },
};

export const configs: IBaseConfig = {
  debug: false,
  platform: "wx",
  unobserveKeys: ["frozen"],
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
