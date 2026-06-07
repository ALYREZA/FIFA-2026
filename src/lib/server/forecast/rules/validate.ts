import type { StageType } from '$lib/server/db/forecast.schema';
import { validateBracketConsistency, type BracketMatch } from './bracket';
import { validateMatchLock, validateStageUnlock, type StageContext } from './locking';
import type { MatchContext, MatchPredictionInput, ValidationError } from './types';

const KNOCKOUT_STAGES: StageType[] = ['r32', 'r16', 'qf', 'sf', 'third_place', 'final'];

export function validateMatchPrediction(
	match: MatchContext,
	stage: StageContext,
	completedStageOrders: number[],
	now: Date,
	prediction: MatchPredictionInput,
	bracketMatches?: BracketMatch[],
	existingPredictions?: Record<string, MatchPredictionInput>
): ValidationError | null {
	if (prediction.homeScore < 0 || prediction.awayScore < 0) {
		return { code: 'invalid_score', message: 'Scores cannot be negative' };
	}

	if (prediction.homeScore > 20 || prediction.awayScore > 20) {
		return { code: 'invalid_score', message: 'Scores must be 20 or less' };
	}

	const stageError = validateStageUnlock(stage, completedStageOrders, now);
	if (stageError) return stageError;

	const lockError = validateMatchLock(match, now);
	if (lockError) return lockError;

	if (KNOCKOUT_STAGES.includes(match.stageType)) {
		if (prediction.homeScore === prediction.awayScore) {
			return {
				code: 'knockout_draw_not_allowed',
				message: 'Knockout matches cannot end in a draw — pick a winner'
			};
		}

		if (bracketMatches && existingPredictions) {
			return validateBracketConsistency(bracketMatches, existingPredictions, match.id, prediction);
		}
	}

	return null;
}
