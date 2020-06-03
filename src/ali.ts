export type ArrayMethod =
  | "push"
  | "pop"
  | "shift"
  | "unshift"
  | "splice"
  | "sort"
  | "reverse";

export function isSupportArrayMethod(method: string) {
  return ["push", "pop", "shift", "unshift", "splice"].indexOf(method) >= 0;
}

export function calcSpliceParam(
  method: ArrayMethod,
  params: any[],
  len: number
) {
  // [start, deleteCount, ...items]
  switch (method) {
    case "push":
      return [len, 0, ...params];
    case "pop":
      return [len - 1, 1];
    // case 'reverse':
    //   return [len, 0, ...params];
    case "shift":
      return [0, 1];
    // case "sort":
    //   return [0, 1];
    case "splice":
      return params;
    case "unshift":
      return [0, 0, ...params];

    default:
      break;
  }

  return params;
}
