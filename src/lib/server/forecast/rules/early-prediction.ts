import type { EarlyPredictionTier } from '$lib/forecast/scoring-rules';

export function getMatchLockTime(kickoffAt: Date, lockMinutesBeforeKickoff: number): Date {
	return new Date(kickoffAt.getTime() - lockMinutesBeforeKickoff * 60_000);
}

export function calculateEarlyPredictionBonus(
	predictionAt: Date,
	kickoffAt: Date,
	lockMinutesBeforeKickoff: number,
	earnedBasePoints: number,
	tiers: EarlyPredictionTier[]
): number {
	if (earnedBasePoints <= 0 || tiers.length === 0) return 0;

	const lockAt = getMatchLockTime(kickoffAt, lockMinutesBeforeKickoff);
	if (predictionAt >= lockAt) return 0;

	const hoursBeforeLock = (lockAt.getTime() - predictionAt.getTime()) / (60 * 60 * 1000);
	const sorted = [...tiers].sort((a, b) => b.minHoursBeforeLock - a.minHoursBeforeLock);

	for (const tier of sorted) {
		if (hoursBeforeLock >= tier.minHoursBeforeLock) {
			return tier.bonus;
		}
	}

	return 0;
}
