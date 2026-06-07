#!/usr/bin/env node
/**
 * Run `wrangler types` with a deterministic result for CI and local check.
 * Hides .dev.vars, .env, and .svelte-kit/cloudflare so output matches a fresh checkout.
 * Use `--write` to regenerate worker-configuration.d.ts; default is `--check`.
 * Runtime secrets are typed in src/env.d.ts.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, renameSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const write = process.argv.includes('--write');

function hideIfPresent(relativePath) {
	const path = join(root, relativePath);
	const backup = `${path}.types-check-bak`;
	if (existsSync(backup)) {
		rmSync(backup, { recursive: true, force: true });
	}
	if (!existsSync(path)) return null;
	renameSync(path, backup);
	return { original: path, backup };
}

function restore(entry) {
	if (!entry || !existsSync(entry.backup)) return;
	if (existsSync(entry.original)) {
		rmSync(entry.original, { recursive: true, force: true });
	}
	renameSync(entry.backup, entry.original);
}

const hidden = [
	hideIfPresent('.dev.vars'),
	hideIfPresent('.env'),
	hideIfPresent('.svelte-kit/cloudflare')
];
const wranglerArgs = write ? ['types'] : ['types', '--check'];

let exitCode;
try {
	const result = spawnSync(
		process.execPath,
		[join(root, 'scripts/wrangler.mjs'), ...wranglerArgs],
		{
			cwd: root,
			env: process.env,
			stdio: 'inherit'
		}
	);
	exitCode = result.status ?? 1;
} finally {
	for (const entry of hidden) {
		restore(entry);
	}
}

process.exit(exitCode ?? 1);
