import typescript from "rollup-plugin-typescript2";
import sourceMaps from "rollup-plugin-sourcemaps";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import fileSize from "rollup-plugin-filesize";
import { terser } from "rollup-plugin-terser";
import * as path from "path";

const isDev = process.env.NODE_ENV === "development";

const output = (prefix) => {
  const p = (...args) => path.join(__dirname, prefix, ...args);

  const extraOutput = isDev
    ? []
    : [
        {
          format: "es",
          file: p("bind.esm.min.js"),
          plugins: [terser(), fileSize()],
          sourcemap: true,
        },
      ];

  return [
    {
      format: "es",
      file: p("bind.esm.js"),
      sourcemap: true,
    },
  ].concat(extraOutput);
};

export default {
  input: "src/index.ts",
  plugins: [typescript(), resolve(), commonjs(), sourceMaps()],
  output: output(isDev ? "miniprogram/mp-bind" : "dist"),
};
