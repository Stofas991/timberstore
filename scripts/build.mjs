// Build: bundles src/ into dist/ and enforces the performance budget (CONTRIBUTING.md 3.4).
import { build } from 'esbuild';
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const BUDGET = { 'dist/timber.min.js': 30 * 1024, 'dist/timber.min.css': 15 * 1024 };

const common = {
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es2020', 'safari14'],
  legalComments: 'none',
  logLevel: 'warning',
};

await build({
  ...common,
  entryPoints: ['src/main.js'],
  outfile: 'dist/timber.min.js',
  format: 'iife',
  define: { __VERSION__: JSON.stringify(`v${pkg.version}`) },
});

await build({
  ...common,
  entryPoints: ['src/main.css'],
  outfile: 'dist/timber.min.css',
});

let failed = false;
for (const [file, limit] of Object.entries(BUDGET)) {
  const size = gzipSync(readFileSync(file)).length;
  const ok = size <= limit;
  failed ||= !ok;
  console.log(
    `${ok ? 'OK  ' : 'FAIL'} ${file}  ${(size / 1024).toFixed(2)} kB gzip / limit ${limit / 1024} kB`,
  );
}
if (failed) {
  console.error('Performance budget exceeded — see CONTRIBUTING.md 3.4');
  process.exit(1);
}
