/**
 * Hide local env files so wrangler commands match CI (no secrets in worker-configuration.d.ts).
 */
import { existsSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const ENV_PATHS = ['.dev.vars', '.env'];
const TYPES_PATHS = [...ENV_PATHS, '.svelte-kit/cloudflare'];

export function hideWranglerEnvFiles(root, { includeBuildOutput = false } = {}) {
	const paths = includeBuildOutput ? TYPES_PATHS : ENV_PATHS;
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

	return paths.map(hideIfPresent);
}

export function restoreWranglerEnvFiles(hidden) {
	function restore(entry) {
		if (!entry || !existsSync(entry.backup)) return;
		if (existsSync(entry.original)) {
			rmSync(entry.original, { recursive: true, force: true });
		}
		renameSync(entry.backup, entry.original);
	}

	for (const entry of hidden) {
		restore(entry);
	}
}
