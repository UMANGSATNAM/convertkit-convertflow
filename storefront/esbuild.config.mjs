/**
 * ConvertKit Storefront — esbuild Configuration
 *
 * Bundles storefront/main.js → public/convertkit-widget.min.js
 * Target: < 40kb gzipped
 */

import * as esbuild from 'esbuild';
import { readFileSync } from 'fs';
import { gzipSync } from 'zlib';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── CSS Loader Plugin ──
// Inlines CSS imports as strings for runtime injection
const cssInlinePlugin = {
  name: 'css-inline',
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, (args) => {
      const css = readFileSync(args.path, 'utf8')
        .replace(/\s+/g, ' ')
        .trim();
      return {
        contents: `export default ${JSON.stringify(css)};`,
        loader: 'js',
      };
    });
  },
};

const outfile = path.resolve(__dirname, '..', 'public', 'convertkit-widget.min.js');

async function build() {
  const result = await esbuild.build({
    entryPoints: [path.resolve(__dirname, 'main.js')],
    bundle: true,
    minify: true,
    sourcemap: false,
    target: ['es2020'],
    format: 'iife',
    outfile,
    plugins: [cssInlinePlugin],
    treeShaking: true,
    metafile: true,
    // Code splitting for lazy imports
    splitting: false, // IIFE doesn't support splitting; inline instead
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });

  // ── Bundle Size Check ──
  const bundle = readFileSync(outfile);
  const gzipped = gzipSync(bundle);
  const rawKb = (bundle.length / 1024).toFixed(2);
  const gzipKb = (gzipped.length / 1024).toFixed(2);

  console.log(`\n  Bundle: ${outfile}`);
  console.log(`  Raw:    ${rawKb} kb`);
  console.log(`  Gzip:   ${gzipKb} kb`);

  if (gzipped.length > 40 * 1024) {
    console.error(`\n  ERROR: Bundle exceeds 40kb gzipped limit! (${gzipKb} kb)`);
    process.exit(1);
  } else {
    console.log(`  Status: PASS (under 40kb gzipped limit)\n`);
  }

  // Print detailed size breakdown
  if (result.metafile) {
    const text = await esbuild.analyzeMetafile(result.metafile);
    console.log(text);
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
