import { and, eq } from 'drizzle-orm';
import type { Database } from '$lib/server/db';
import { userScores } from '$lib/server/db/forecast.schema';
import { COIN_RULES } from '$lib/forecast/game-rules';
import { getStartingCoinBalance } from '$lib/server/user';

export async function ensureUserCoinBalance(
	db: Database,
	userId: string,
	tournamentId: string
): Promise<number> {
	const [existing] = await db
		.select()
		.from(userScores)
		.where(and(eq(userScores.userId, userId), eq(userScores.tournamentId, tournamentId)))
		.limit(1);

	if (existing) return existing.coinBalance;

	const now = new Date();
	await db.insert(userScores).values({
		id: crypto.randomUUID(),
		userId,
		tournamentId,
		coinBalance: getStartingCoinBalance(),
		updatedAt: now
	});

	return getStartingCoinBalance();
}

export async function deductCoins(
	db: Database,
	userId: string,
	tournamentId: string,
	amount: number
): Promise<{ success: true; newBalance: number } | { error: { code: string; message: string } }> {
	const balance = await ensureUserCoinBalance(db, userId, tournamentId);

	if (balance < amount) {
		return {
			error: {
				code: 'insufficient_coins',
				message: `Not enough coins. Need ${amount}, have ${balance}.`
			}
		};
	}

	if (balance - amount < COIN_RULES.minimumBalance) {
		return {
			error: {
				code: 'minimum_balance',
				message: `You must keep at least ${COIN_RULES.minimumBalance} coins.`
			}
		};
	}

	const newBalance = balance - amount;
	const now = new Date();

	await db
		.update(userScores)
		.set({ coinBalance: newBalance, updatedAt: now })
		.where(and(eq(userScores.userId, userId), eq(userScores.tournamentId, tournamentId)));

	return { success: true, newBalance };
}
