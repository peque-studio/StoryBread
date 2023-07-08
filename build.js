import { createRequire } from "module"; // because node is dumb
const require = createRequire(import.meta.url);

import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import htmlPlugin from '@chialab/esbuild-plugin-html'; 

await esbuild.build({
  entryPoints: ['src/pages/project/index.html'],
  bundle: true,
  outdir: 'dist',
  assetNames: 'assets/[name]-[hash]',
  chunkNames: '[ext]/[name]-[hash]',
  sourcemap: true,
  metafile: true,
  plugins: [sassPlugin(), htmlPlugin()]
});