export interface PlatformComponentConfig {
  reserveKeys: string[];
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
    ctor: Page,
  },
  component: {
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
      "route",
      "options",
    ],
    ctor: Page,
  },
  component: {
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
    // @ts-ignore
    ctor: Component,
  },
};
