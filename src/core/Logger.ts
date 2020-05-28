import { configs } from "./config";

export function logger(...args: any) {
  if (configs.debug) {
    const prefix = `${new Date().toISOString()}: `;
    console.log(prefix, ...args);
  }
}
