export interface PlatformComponentConfig {
  reserveKeys: string[];
  lifecycleKeys: string[];
  unobserveKeys: string[];
  ctor: any;
}

export interface PlatformConfig {
  page: PlatformComponentConfig;
  component: PlatformComponentConfig;
}

export const aliPlatformConfig: PlatformConfig = {
  page: {
    reserveKeys: [
      "applyDataUpdates",
      "createIntersectionObserver",
      "createSelectorQuery",
      "data",
      "dataset",
      "getRelationNodes",
      "groupSetData",
      "hasBehavior",
      "id",
      "is",
      "mergeDataOnPath",
      "properties",
      "replaceDataOnPath",
      "selectAllComponents",
      "selectComponent",
      "setData",
      "triggerEvent",
      "route",
      "options",
    ],
    lifecycleKeys: [
      "onLoad",
      "onShow",
      "onReady",
      "onHide",
      "onUnload",
      "onTitleClick",
      "onPullDownRefresh",
      "onReachBottom",
      "onShareAppMessage",
    ],
    unobserveKeys: [],
    ctor: Page,
  },
  component: {
    reserveKeys: [
      "methods",
      "applyDataUpdates",
      "createIntersectionObserver",
      "createSelectorQuery",
      "data",
      "dataset",
      "getRelationNodes",
      "groupSetData",
      "hasBehavior",
      "id",
      "is",
      "mergeDataOnPath",
      "properties",
      "replaceDataOnPath",
      "selectAllComponents",
      "selectComponent",
      "setData",
      "triggerEvent",
    ],
    unobserveKeys: ["props", "mixins"],
    lifecycleKeys: [
      "onInit",
      "deriveDataFromProps",
      "didMount",
      "didUpdate",
      "didUnmount",
    ],
    // @ts-ignore
    ctor: Component,
  },
};

export const wxPlatformConfig: PlatformConfig = {
  page: {
    reserveKeys: [
      "applyDataUpdates",
      "createIntersectionObserver",
      "createSelectorQuery",
      "data",
      "dataset",
      "getRelationNodes",
      "groupSetData",
      "hasBehavior",
      "id",
      "is",
      "mergeDataOnPath",
      "properties",
      "replaceDataOnPath",
      "selectAllComponents",
      "selectComponent",
      "setData",
      "triggerEvent",
    ],
    unobserveKeys: [],
    lifecycleKeys: [
      "onLoad",
      "onShow",
      "onReady",
      "onHide",
      "onUnload",
      "onPullDownRefresh",
      "onReachBottom",
      "onShareAppMessage",
      "onPageScroll",
      "onResize",
      "onTabItemTap",
    ],
    ctor: Page,
  },
  component: {
    reserveKeys: [
      "data",
      "observers",
      "methods",
      "behaviors",
      "created",
      "attached",
      "ready",
      "moved",
      "detached",
      "relations",
      "lifetimes",
      "pageLifetimes",
      "definitionFilter",
    ],
    unobserveKeys: ["properties", "options", "externalClasses"],
    lifecycleKeys: [],
    // @ts-ignore
    ctor: Component,
  },
};
