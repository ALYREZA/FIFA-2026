#!/usr/bin/env node
/**
 * Apply local D1 migrations when the database has not been initialized yet,
 * or when pending schema migrations are missing.
 */
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const wrangler = join(root, 'scripts/wrangler.mjs');

const devVars = join(root, '.dev.vars');
const devVarsExample = join(root, '.dev.vars.example');
if (!existsSync(devVars) && existsSync(devVarsExample)) {
	console.log('Creating .dev.vars from .dev.vars.example');
	copyFileSync(devVarsExample, devVars);
}

function runWrangler(args) {
	const result = spawnSync(process.execPath, [wrangler, ...args], {
		cwd: root,
		encoding: 'utf8'
	});
	if (result.status !== 0) {
		console.error(result.stderr || result.stdout);
		process.exit(result.status ?? 1);
	}
	return result.stdout;
}

function hasTable(tableName) {
	const out = runWrangler([
		'd1',
		'execute',
		'fifa-2026',
		'--local',
		'--command',
		`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`
	]);
	return out.includes(tableName);
}

function hasColumn(tableName, columnName) {
	const out = runWrangler([
		'd1',
		'execute',
		'fifa-2026',
		'--local',
		'--command',
		`PRAGMA table_info(${tableName});`
	]);
	return out.includes(columnName);
}

if (!hasTable('tournaments')) {
	console.log('Local D1 not initialized — applying migrations...');
	const migrate = spawnSync('pnpm', ['db:local'], { cwd: root, stdio: 'inherit', shell: true });
	process.exit(migrate.status ?? 1);
}

if (!hasColumn('matches', 'stadium_id')) {
	console.log('Applying pending migration: 0005_match_stadium.sql');
	runWrangler([
		'd1',
		'execute',
		'fifa-2026',
		'--local',
		'--file=migrations/0005_match_stadium.sql'
	]);
}
