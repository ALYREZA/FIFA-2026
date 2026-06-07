import type { MatchPredictionInput, MatchResult, ScoreBreakdown, ScoringRules } from './types';

export function getMatchResult(homeScore: number, awayScore: number): 'home' | 'away' | 'draw' {
	if (homeScore > awayScore) return 'home';
	if (awayScore > homeScore) return 'away';
	return 'draw';
}

export function scoreGroupPrediction(
	predicted: MatchPredictionInput,
	actual: MatchResult,
	rules: ScoringRules
): ScoreBreakdown {
	const breakdown: ScoreBreakdown = { total: 0 };

	if (predicted.homeScore === actual.homeScore && predicted.awayScore === actual.awayScore) {
		breakdown.exactScore = rules.group.exactScore;
		breakdown.total += rules.group.exactScore;
		return breakdown;
	}

	const predictedResult = getMatchResult(predicted.homeScore, predicted.awayScore);
	const actualResult = getMatchResult(actual.homeScore, actual.awayScore);

	if (predictedResult === actualResult) {
		breakdown.correctResult = rules.group.correctResult;
		breakdown.total += rules.group.correctResult;
	}

	const predictedDiff = Math.abs(predicted.homeScore - predicted.awayScore);
	const actualDiff = Math.abs(actual.homeScore - actual.awayScore);

	if (predictedDiff === actualDiff && predictedResult === actualResult) {
		breakdown.correctGoalDiff = rules.group.correctGoalDiff;
		breakdown.total += rules.group.correctGoalDiff;
	}

	return breakdown;
}
