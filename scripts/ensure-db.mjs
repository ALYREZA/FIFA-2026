#!/usr/bin/env node
/**
 * Apply local D1 migrations when the database has not been initialized yet.
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const wrangler = join(root, 'scripts/wrangler.mjs');

const check = spawnSync(
	process.execPath,
	[
		wrangler,
		'd1',
		'execute',
		'fifa-2026',
		'--local',
		'--command',
		"SELECT name FROM sqlite_master WHERE type='table' AND name='tournaments';"
	],
	{ cwd: root, encoding: 'utf8' }
);

if (check.status !== 0) {
	console.error(check.stderr || check.stdout);
	process.exit(check.status ?? 1);
}

if (check.stdout.includes('tournaments')) {
	process.exit(0);
}

console.log('Local D1 not initialized — applying migrations...');
const migrate = spawnSync('pnpm', ['db:local'], { cwd: root, stdio: 'inherit', shell: true });
process.exit(migrate.status ?? 1);
