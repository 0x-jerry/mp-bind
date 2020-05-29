import { configs } from "./config";

export class Logger {
  ns: string;
  enable: boolean;

  get prefix() {
    const ns = this.ns ? `[${this.ns}]` : "";
    return `${ns}(${new Date().toLocaleTimeString()})`;
  }

  constructor(ns: string = "") {
    this.ns = ns;
    this.enable = true;
  }

  log(...args: any) {
    if (!configs.debug || !this.enable) {
      return;
    }

    console.log(this.prefix, ...args);
  }

  warn(...args: any) {
    if (!configs.debug || !this.enable) {
      return;
    }

    console.warn(this.prefix, ...args);
  }

  error(...args: any) {
    if (!this.enable) {
      return;
    }

    console.error(this.prefix, ...args);
  }
}

export const logger = new Logger("");
