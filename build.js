import { createRequire } from "module"; // because node is dumb
const require = createRequire(import.meta.url);

import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import htmlPlugin from '@chialab/esbuild-plugin-html'; 
import { clean } from 'esbuild-plugin-clean';
import progress from 'esbuild-plugin-progress';
import * as process from "process";

/** @type {"serve" | "build"} */
const buildMode = process.argv.length > 2 ? process.argv[2] : "build";

/** @type {esbuild.BuildOptions} */
const commonConfig = {
  entryPoints: ['src/pages/project/index.html'],
  bundle: true,
  outdir: 'dist',
  assetNames: 'assets/[name]-[hash]',
  chunkNames: '[ext]/[name]-[hash]',
  sourcemap: true,
  metafile: true,
  plugins: [
    sassPlugin({
      cssImports: true
    }),
    htmlPlugin(),
    clean({ patterns: ['./dist/*'] }),
    progress(),
  ]
};

if (buildMode === "build") {
  await esbuild.build(commonConfig);
} else if (buildMode === "serve") {
  const ctx = await esbuild.context(commonConfig);
  ctx.watch({});
  console.log("Serving on http://localhost:3000/");
  await ctx.serve({ servedir: './dist', port: 3000 });
}
