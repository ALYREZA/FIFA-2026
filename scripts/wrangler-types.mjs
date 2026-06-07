#!/usr/bin/env node
/**
 * Run `wrangler types` without local .dev.vars / .env influencing the result.
 * Use `--write` to regenerate worker-configuration.d.ts; default is `--check`.
 * Runtime secrets are typed in src/env.d.ts.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const write = process.argv.includes('--write');

function hideIfPresent(filename) {
	const path = join(root, filename);
	if (!existsSync(path)) return null;
	const backup = `${path}.types-check-bak`;
	renameSync(path, backup);
	return { original: path, backup };
}

function restore(entry) {
	if (!entry) return;
	renameSync(entry.backup, entry.original);
}

const hidden = [hideIfPresent('.dev.vars'), hideIfPresent('.env')];
const wranglerArgs = write ? ['types'] : ['types', '--check'];

try {
	const result = spawnSync(process.execPath, [join(root, 'scripts/wrangler.mjs'), ...wranglerArgs], {
		cwd: root,
		env: process.env,
		stdio: 'inherit'
	});
	process.exit(result.status ?? 1);
} finally {
	for (const entry of hidden) {
		restore(entry);
	}
}
