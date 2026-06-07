#!/usr/bin/env node
/**
 * Run wrangler from the project root with wrangler.jsonc always loaded.
 * Strips parent Yarn PnP hooks so esbuild resolves deps from node_modules.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = join(root, 'wrangler.jsonc');
const wranglerBin = join(root, 'node_modules/wrangler/bin/wrangler.js');

if (!existsSync(wranglerBin)) {
	console.error('wrangler is not installed. Run: pnpm install');
	process.exit(1);
}

if (!existsSync(configPath)) {
	console.error(`Missing ${configPath}`);
	process.exit(1);
}

// Parent monorepos may inject Yarn PnP via NODE_OPTIONS — drop it for wrangler/esbuild.
const nodeOptions = process.env.NODE_OPTIONS ?? '';
process.env.NODE_OPTIONS = nodeOptions
	.replace(/(?:^|\s)--(?:require|import)\s+\S*\.pnp\.cjs/g, '')
	.trim();

process.env.YARN_IGNORE_PATH = '1';

const args = ['--config', configPath, ...process.argv.slice(2)];
const result = spawnSync(process.execPath, [wranglerBin, ...args], {
	cwd: root,
	env: process.env,
	stdio: 'inherit'
});

process.exit(result.status ?? 1);
