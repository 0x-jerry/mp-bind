import { BaseConfigs } from "./config";

export function logger(...args: any) {
  if (BaseConfigs.debug) {
    const prefix = `${new Date().toISOString()}: `;
    console.log(prefix, ...args);
  }
}
