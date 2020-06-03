import typescript from "rollup-plugin-typescript2";
import sourceMaps from "rollup-plugin-sourcemaps";
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/core/index.ts",
  plugins: [typescript(), resolve(), commonjs(), sourceMaps()],
  output: [
    {
      format: "cjs",
      file: "dist/bind.cjs.js",
      sourcemap: true,
    },
    {
      format: "es",
      file: "dist/bind.esm.js",
      sourcemap: true,
    },
    {
      format: "cjs",
      file: "dist/bind.cjs.min.js",
      plugins: [terser()],
      sourcemap: true,
    },
    {
      format: "es",
      file: "dist/bind.esm.min.js",
      plugins: [terser()],
      sourcemap: true,
    },
  ],
};
