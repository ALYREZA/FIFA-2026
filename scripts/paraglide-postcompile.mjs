#!/usr/bin/env node
/**
 * Paraglide emits JS checked by svelte-check. Cloudflare worker Request types
 * conflict with the generated cloneRequestWithFallback helpers — skip TS on that file.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = ['src/lib/paraglide/server.js'];

for (const relativePath of files) {
	const path = join(root, relativePath);
	let content = readFileSync(path, 'utf8');
	if (!content.startsWith('// @ts-nocheck')) {
		writeFileSync(path, `// @ts-nocheck\n${content}`);
	}
}
