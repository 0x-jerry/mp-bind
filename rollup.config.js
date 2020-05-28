import typescript from "rollup-plugin-typescript";
import sourceMaps from "rollup-plugin-sourcemaps";

export default {
  input: "src/core/index.ts",
  plugins: [typescript(), sourceMaps()],
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
  ],
};
