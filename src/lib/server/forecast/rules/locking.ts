import type { MatchContext, StageContext, ValidationError } from './types';

export type { StageContext };

export function getPredictionLockTime(match: MatchContext): Date {
	return new Date(match.kickoffAt.getTime() - match.lockMinutesBeforeKickoff * 60_000);
}

export function isMatchLocked(match: MatchContext, now: Date): boolean {
	if (match.status === 'locked' || match.status === 'live' || match.status === 'finished') {
		return true;
	}

	return now >= getPredictionLockTime(match);
}

export function isStageUnlocked(
	stage: StageContext,
	completedStageOrders: number[],
	now: Date
): boolean {
	if (stage.unlockAfterOrder === null) {
		return true;
	}

	const prerequisiteMet = completedStageOrders.includes(stage.unlockAfterOrder);

	if (!prerequisiteMet) {
		return false;
	}

	if (stage.deadlineAt && now > stage.deadlineAt) {
		return false;
	}

	return true;
}

export function validateMatchLock(
	match: MatchContext,
	now: Date
): ValidationError | null {
	if (isMatchLocked(match, now)) {
		return {
			code: 'match_locked',
			message: 'Predictions are locked for this match'
		};
	}

	return null;
}

export function validateStageUnlock(
	stage: StageContext,
	completedStageOrders: number[],
	now: Date
): ValidationError | null {
	if (!isStageUnlocked(stage, completedStageOrders, now)) {
		return {
			code: 'stage_locked',
			message: 'This stage is not yet open for predictions'
		};
	}

	return null;
}

export function validateExtrasLock(
	extrasLockedAt: Date | null,
	now: Date
): ValidationError | null {
	if (extrasLockedAt && now >= extrasLockedAt) {
		return {
			code: 'extras_locked',
			message: 'Tournament extras predictions are locked'
		};
	}

	return null;
}
