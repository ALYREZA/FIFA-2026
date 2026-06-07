import type {
	GroupStandingInput,
	GroupStandingResult,
	ScoreBreakdown,
	ScoringRules,
	ValidationError
} from './types';

export function validateGroupStandings(predictions: GroupStandingInput[]): ValidationError | null {
	const byGroup = new Map<string, GroupStandingInput[]>();

	for (const prediction of predictions) {
		const group = byGroup.get(prediction.groupId) ?? [];
		group.push(prediction);
		byGroup.set(prediction.groupId, group);
	}

	for (const [, groupPredictions] of byGroup) {
		const positions = groupPredictions.map((p) => p.predictedPosition);
		const uniquePositions = new Set(positions);

		if (uniquePositions.size !== positions.length) {
			return {
				code: 'duplicate_position',
				message: 'Each position in a group can only be assigned once'
			};
		}

		for (const position of positions) {
			if (position < 1 || position > 4) {
				return {
					code: 'invalid_position',
					message: 'Group positions must be between 1 and 4'
				};
			}
		}
	}

	return null;
}

export function scoreGroupStandings(
	predictions: GroupStandingInput[],
	actuals: GroupStandingResult[],
	rules: ScoringRules
): ScoreBreakdown {
	const breakdown: ScoreBreakdown = { total: 0 };
	const actualMap = new Map(actuals.map((a) => [`${a.groupId}:${a.teamId}`, a.actualPosition]));

	for (const prediction of predictions) {
		const actualPosition = actualMap.get(`${prediction.groupId}:${prediction.teamId}`);
		if (actualPosition === undefined) continue;

		if (prediction.predictedPosition === actualPosition) {
			breakdown.positionExact = (breakdown.positionExact ?? 0) + rules.standings.positionExact;
			breakdown.total += rules.standings.positionExact;
		} else if (Math.abs(prediction.predictedPosition - actualPosition) === 1) {
			breakdown.positionOffByOne =
				(breakdown.positionOffByOne ?? 0) + rules.standings.positionOffByOne;
			breakdown.total += rules.standings.positionOffByOne;
		}
	}

	return breakdown;
}
