import type {
	ScoreBreakdown,
	ScoringRules,
	TournamentExtrasInput,
	TournamentExtrasResult,
	ValidationError
} from './types';

export function validateTournamentExtras(
	input: TournamentExtrasInput
): ValidationError | null {
	if (!input.championTeamId) {
		return { code: 'champion_required', message: 'Champion pick is required' };
	}

	if (input.championTeamId && input.runnerUpTeamId && input.championTeamId === input.runnerUpTeamId) {
		return {
			code: 'same_champion_runner_up',
			message: 'Champion and runner-up must be different teams'
		};
	}

	if (input.championTeamId && input.darkHorseTeamId && input.championTeamId === input.darkHorseTeamId) {
		return {
			code: 'dark_horse_is_champion',
			message: 'Dark horse cannot be the same as your champion pick'
		};
	}

	return null;
}

export function scoreTournamentExtras(
	predicted: TournamentExtrasInput,
	actual: TournamentExtrasResult,
	rules: ScoringRules
): ScoreBreakdown {
	const breakdown: ScoreBreakdown = { total: 0 };

	if (
		predicted.championTeamId &&
		actual.championTeamId &&
		predicted.championTeamId === actual.championTeamId
	) {
		breakdown.champion = rules.extras.champion;
		breakdown.total += rules.extras.champion;
	}

	if (
		predicted.runnerUpTeamId &&
		actual.runnerUpTeamId &&
		predicted.runnerUpTeamId === actual.runnerUpTeamId
	) {
		breakdown.runnerUp = rules.extras.runnerUp;
		breakdown.total += rules.extras.runnerUp;
	}

	if (
		predicted.topScorerName &&
		actual.topScorerName &&
		predicted.topScorerName.trim().toLowerCase() === actual.topScorerName.trim().toLowerCase()
	) {
		breakdown.topScorer = rules.extras.topScorer;
		breakdown.total += rules.extras.topScorer;
	}

	if (
		predicted.darkHorseTeamId &&
		actual.darkHorseTeamId &&
		predicted.darkHorseTeamId === actual.darkHorseTeamId
	) {
		breakdown.darkHorse = rules.extras.darkHorse;
		breakdown.total += rules.extras.darkHorse;
	}

	return breakdown;
}
