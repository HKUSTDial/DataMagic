import {buildSync} from 'esbuild';
import {mkdtempSync, unlinkSync, rmdirSync} from 'node:fs';
import {fileURLToPath, pathToFileURL} from 'node:url';
import path from 'node:path';

// Import the real modules on Node 20 too, without executing source strings or
// substituting dependency mocks. The private temporary module resolves the
// existing cards/node_modules and is removed after import.
export async function loadTypeScript(url) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const input = fileURLToPath(url);
  if (!input.startsWith(root)) throw new Error('Test source must belong to cards');
  const dir = mkdtempSync(path.join(root, '.test-module-'));
  const output = path.join(dir, 'module.mjs');
  try {
    buildSync({entryPoints: [input], outfile: output, bundle: true, platform: 'node', format: 'esm', packages: 'external', logLevel: 'silent'});
    return await import(pathToFileURL(output).href);
  } finally {
    try { unlinkSync(output); } finally { rmdirSync(dir); }
  }
}
