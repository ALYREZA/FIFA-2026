import type { StageType } from '$lib/server/db/forecast.schema';
import { scoreGroupPrediction } from './group-stage';
import { scoreKnockoutPrediction } from './knockout';
import type { MatchPredictionInput, MatchResult, ScoreBreakdown, ScoringRules } from './types';

const KNOCKOUT_STAGES: StageType[] = ['r32', 'r16', 'qf', 'sf', 'third_place', 'final'];

export function scoreMatchPrediction(
	stageType: StageType,
	predicted: MatchPredictionInput,
	actual: MatchResult,
	homeTeamId: string | null,
	awayTeamId: string | null,
	rules: ScoringRules
): ScoreBreakdown {
	if (stageType === 'group') {
		return scoreGroupPrediction(predicted, actual, rules);
	}

	if (KNOCKOUT_STAGES.includes(stageType)) {
		return scoreKnockoutPrediction(predicted, actual, homeTeamId, awayTeamId, rules);
	}

	return { total: 0 };
}

export function isExactScore(breakdown: ScoreBreakdown): boolean {
	return (breakdown.exactScore ?? 0) > 0;
}

export function isCorrectResult(breakdown: ScoreBreakdown): boolean {
	return (
		(breakdown.correctResult ?? 0) > 0 ||
		(breakdown.correctWinner ?? 0) > 0 ||
		(breakdown.exactScore ?? 0) > 0
	);
}
