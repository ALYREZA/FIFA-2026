import { eq } from 'drizzle-orm';
import type { Database } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';
import { COIN_RULES, RESERVED_USERNAMES, USERNAME_RULES } from '$lib/forecast/game-rules';

export type UsernameErrorCode =
	| 'invalid_format'
	| 'too_short'
	| 'too_long'
	| 'reserved'
	| 'taken'
	| 'already_set';

export function normalizeUsername(input: string): string {
	return input.trim().toLowerCase();
}

export function validateUsername(input: string): { code: UsernameErrorCode } | null {
	const username = normalizeUsername(input);

	if (username.length < USERNAME_RULES.minLength) {
		return { code: 'too_short' };
	}

	if (username.length > USERNAME_RULES.maxLength) {
		return { code: 'too_long' };
	}

	if (!USERNAME_RULES.pattern.test(username)) {
		return { code: 'invalid_format' };
	}

	if (RESERVED_USERNAMES.has(username)) {
		return { code: 'reserved' };
	}

	return null;
}

export async function isUsernameTaken(db: Database, username: string, excludeUserId?: string) {
	const normalized = normalizeUsername(username);
	const [existing] = await db
		.select({ id: user.id })
		.from(user)
		.where(eq(user.username, normalized))
		.limit(1);

	if (!existing) return false;
	if (excludeUserId && existing.id === excludeUserId) return false;
	return true;
}

export async function getUserByUsername(db: Database, username: string) {
	const normalized = normalizeUsername(username);
	const [found] = await db.select().from(user).where(eq(user.username, normalized)).limit(1);
	return found ?? null;
}

export async function setUsername(db: Database, userId: string, rawUsername: string) {
	const [current] = await db.select().from(user).where(eq(user.id, userId)).limit(1);
	if (!current) {
		return { error: { code: 'not_found' as const, message: 'User not found' } };
	}

	if (current.username) {
		return { error: { code: 'already_set' as const, message: 'Username is already set' } };
	}

	const validationError = validateUsername(rawUsername);
	if (validationError) {
		return { error: validationError };
	}

	const username = normalizeUsername(rawUsername);
	if (await isUsernameTaken(db, username, userId)) {
		return { error: { code: 'taken' as const, message: 'Username is already taken' } };
	}

	const now = new Date();
	await db
		.update(user)
		.set({
			username,
			name: username,
			updatedAt: now
		})
		.where(eq(user.id, userId));

	return { success: true, username };
}

export function getStartingCoinBalance() {
	return COIN_RULES.startingBalance;
}
