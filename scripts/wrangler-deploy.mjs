#!/usr/bin/env node
/**
 * Deploy with .dev.vars / .env hidden so wrangler's types check matches worker-configuration.d.ts.
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hideWranglerEnvFiles, restoreWranglerEnvFiles } from './wrangler-env-isolation.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const hidden = hideWranglerEnvFiles(root);

let exitCode;
try {
	const result = spawnSync(
		process.execPath,
		[join(root, 'scripts/wrangler.mjs'), 'deploy', ...process.argv.slice(2)],
		{
			cwd: root,
			env: process.env,
			stdio: 'inherit'
		}
	);
	exitCode = result.status ?? 1;
} finally {
	restoreWranglerEnvFiles(hidden);
}

process.exit(exitCode ?? 1);
