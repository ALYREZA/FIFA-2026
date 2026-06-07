import type { MatchPredictionInput, MatchResult, ScoreBreakdown, ScoringRules } from './types';
import { getMatchResult } from './group-stage';

export function getWinnerTeamId(
	homeTeamId: string | null,
	awayTeamId: string | null,
	homeScore: number,
	awayScore: number
): string | null {
	if (!homeTeamId || !awayTeamId) return null;
	if (homeScore > awayScore) return homeTeamId;
	if (awayScore > homeScore) return awayTeamId;
	return null;
}

export function scoreKnockoutPrediction(
	predicted: MatchPredictionInput,
	actual: MatchResult,
	homeTeamId: string | null,
	awayTeamId: string | null,
	rules: ScoringRules
): ScoreBreakdown {
	const breakdown: ScoreBreakdown = { total: 0 };

	const predictedWinner = getWinnerTeamId(
		homeTeamId,
		awayTeamId,
		predicted.homeScore,
		predicted.awayScore
	);

	if (predictedWinner && actual.winnerTeamId && predictedWinner === actual.winnerTeamId) {
		breakdown.correctWinner = rules.knockout.correctWinner;
		breakdown.total += rules.knockout.correctWinner;
	}

	if (
		predicted.homeScore === actual.homeScore &&
		predicted.awayScore === actual.awayScore
	) {
		breakdown.exactScore = rules.knockout.exactScoreBonus;
		breakdown.total += rules.knockout.exactScoreBonus;
	}

	return breakdown;
}

export function deriveWinnerFromPrediction(
	predicted: MatchPredictionInput,
	homeTeamId: string | null,
	awayTeamId: string | null
): string | null {
	const result = getMatchResult(predicted.homeScore, predicted.awayScore);
	if (result === 'draw') return null;
	if (result === 'home') return homeTeamId;
	return awayTeamId;
}
