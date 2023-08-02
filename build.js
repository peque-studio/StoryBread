import { createRequire } from "module"; // because node is dumb
const require = createRequire(import.meta.url);

import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import htmlPlugin from '@chialab/esbuild-plugin-html'; 
import { clean } from 'esbuild-plugin-clean';
import ora from 'ora';
import * as process from "process";

/** @type {"serve" | "build"} */
const buildMode = process.argv.length > 2 ? process.argv[2] : "build";

/** @returns {esbuild.Plugin} */
const progressPlugin = ({ message = 'Building' } = {}) => {
  const spinner = ora({
    text: message,
    isEnabled: false
  });

  return {
    name: 'progress',
    setup(build) {
      build.onStart(() => {
        spinner.start();
      });

      build.onEnd((result) => {
        if (result.errors.length > 0) {
          spinner.fail(`Build failed with ${result.errors.length} error${result.errors.length > 1 ? 's' : ''}`);
        } else {
          spinner.succeed("Build succeded!");
        }
      });
    },
  };
}

/** @type {esbuild.BuildOptions} */
const ctx = await esbuild.context({
  entryPoints: [
    'src/pages/project/index.html',
    'src/pages/auth/index.html',
    'src/pages/dashboard/index.html'
  ],
  assetNames: 'assets/[name]-[hash]',
  chunkNames: '[ext]/[name]-[hash]',
  entryNames: '[dir]/[name]',
  bundle: true,
  outdir: 'dist',
  sourcemap: true,
  metafile: true,
  loader: {'.svg': 'file', '.png': 'file', '.ttf': 'file'},
  plugins: [
    sassPlugin({
      cssImports: true
    }),
    htmlPlugin(),
    clean({ patterns: ['./dist/*'] }),
    progressPlugin(),
  ]
});

if (buildMode === "build") {
  await ctx.rebuild();
} else if (buildMode === "serve") {
  await ctx.watch();

  const { host, port } = await ctx.serve({
    servedir: 'dist',
  });

  console.log(`Serving on http://${host}:${port}/`);
}
