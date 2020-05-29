import typescript from "rollup-plugin-typescript2";
import sourceMaps from "rollup-plugin-sourcemaps";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/core/index.ts",
  plugins: [typescript(), sourceMaps()],
  output: [
    {
      format: "cjs",
      file: "dist/bind.cjs.js",
    },
    {
      format: "es",
      file: "dist/bind.esm.js",
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
