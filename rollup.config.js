import typescript from "rollup-plugin-typescript2";
import sourceMaps from "rollup-plugin-sourcemaps";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import * as path from "path";

const isDev = process.env.NODE_ENV === "development";

const output = (prefix) => {
  const p = (...args) => path.join(__dirname, prefix, ...args);

  return [
    {
      format: "cjs",
      file: p("bind.cjs.js"),
      sourcemap: true,
    },
    {
      format: "es",
      file: p("bind.esm.js"),
      sourcemap: true,
    },
    {
      format: "cjs",
      file: p("bind.cjs.min.js"),
      plugins: [terser()],
      sourcemap: true,
    },
    {
      format: "es",
      file: p("bind.esm.min.js"),
      plugins: [terser()],
      sourcemap: true,
    },
  ];
};

export default {
  input: "src/index.ts",
  plugins: [typescript(), resolve(), commonjs(), sourceMaps()],
  output: output(isDev ? "miniprogram/mp-bind" : "dist"),
};
