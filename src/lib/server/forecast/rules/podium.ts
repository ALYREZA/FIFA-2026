import { COIN_RULES } from '$lib/forecast/game-rules';
import type { ScoreBreakdown, ScoringRules, ValidationError } from './types';

export type PodiumPredictionInput = {
	firstPlaceTeamId: string;
	secondPlaceTeamId: string;
	thirdPlaceTeamId: string;
};

export type PodiumResult = {
	firstPlaceTeamId: string | null;
	secondPlaceTeamId: string | null;
	thirdPlaceTeamId: string | null;
};

export function getPodiumOpensAt(tournamentStartsAt: Date): Date {
	const opensAt = new Date(tournamentStartsAt);
	opensAt.setUTCDate(opensAt.getUTCDate() - COIN_RULES.podium.opensDaysBeforeStart);
	return opensAt;
}

export function getPodiumLocksAt(extrasLockedAt: Date | null, tournamentStartsAt: Date): Date {
	return extrasLockedAt ?? tournamentStartsAt;
}

export function calculatePodiumCost(now: Date, opensAt: Date, locksAt: Date): number {
	const { maxCost, minCost } = COIN_RULES.podium;

	if (now >= locksAt) return minCost;
	if (now <= opensAt) return maxCost;

	const totalMs = locksAt.getTime() - opensAt.getTime();
	const elapsedMs = now.getTime() - opensAt.getTime();
	const ratio = elapsedMs / totalMs;

	return Math.round(maxCost - ratio * (maxCost - minCost));
}

export function validatePodiumPrediction(input: PodiumPredictionInput): ValidationError | null {
	const { firstPlaceTeamId, secondPlaceTeamId, thirdPlaceTeamId } = input;

	if (!firstPlaceTeamId || !secondPlaceTeamId || !thirdPlaceTeamId) {
		return { code: 'teams_required', message: 'All three podium positions are required' };
	}

	const teamIds = [firstPlaceTeamId, secondPlaceTeamId, thirdPlaceTeamId];
	const unique = new Set(teamIds);
	if (unique.size !== 3) {
		return { code: 'duplicate_teams', message: 'All three teams must be different' };
	}

	return null;
}

export function validatePodiumSubmission(
	now: Date,
	opensAt: Date,
	locksAt: Date,
	alreadySubmitted: boolean
): ValidationError | null {
	if (alreadySubmitted) {
		return {
			code: 'already_submitted',
			message: 'Podium prediction cannot be changed once submitted'
		};
	}

	if (now >= locksAt) {
		return { code: 'podium_locked', message: 'Podium predictions are locked' };
	}

	if (now < opensAt) {
		return { code: 'podium_not_open', message: 'Podium predictions are not open yet' };
	}

	return null;
}

export function scorePodiumPrediction(
	predicted: PodiumPredictionInput,
	actual: PodiumResult,
	rules: ScoringRules
): ScoreBreakdown {
	const breakdown: ScoreBreakdown = { total: 0 };

	if (
		predicted.firstPlaceTeamId &&
		actual.firstPlaceTeamId &&
		predicted.firstPlaceTeamId === actual.firstPlaceTeamId
	) {
		breakdown.podiumFirst = rules.podium.firstPlace;
		breakdown.total += rules.podium.firstPlace;
	}

	if (
		predicted.secondPlaceTeamId &&
		actual.secondPlaceTeamId &&
		predicted.secondPlaceTeamId === actual.secondPlaceTeamId
	) {
		breakdown.podiumSecond = rules.podium.secondPlace;
		breakdown.total += rules.podium.secondPlace;
	}

	if (
		predicted.thirdPlaceTeamId &&
		actual.thirdPlaceTeamId &&
		predicted.thirdPlaceTeamId === actual.thirdPlaceTeamId
	) {
		breakdown.podiumThird = rules.podium.thirdPlace;
		breakdown.total += rules.podium.thirdPlace;
	}

	return breakdown;
}
