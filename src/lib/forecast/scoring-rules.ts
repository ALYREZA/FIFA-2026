export type EarlyPredictionTier = {
	minHoursBeforeLock: number;
	bonus: number;
};

export type ScoringRules = {
	group: { exactScore: number; correctResult: number; correctGoalDiff: number };
	knockout: { correctWinner: number; exactScoreBonus: number };
	standings: { positionExact: number; positionOffByOne: number };
	extras: { champion: number; runnerUp: number; topScorer: number; darkHorse: number };
	podium: { firstPlace: number; secondPlace: number; thirdPlace: number };
	earlyPrediction: { tiers: EarlyPredictionTier[] };
};

export const DEFAULT_SCORING_RULES: ScoringRules = {
	group: { exactScore: 5, correctResult: 2, correctGoalDiff: 1 },
	knockout: { correctWinner: 3, exactScoreBonus: 2 },
	standings: { positionExact: 4, positionOffByOne: 2 },
	extras: { champion: 10, runnerUp: 5, topScorer: 8, darkHorse: 6 },
	podium: { firstPlace: 15, secondPlace: 10, thirdPlace: 8 },
	earlyPrediction: {
		tiers: [
			{ minHoursBeforeLock: 48, bonus: 3 },
			{ minHoursBeforeLock: 24, bonus: 2 },
			{ minHoursBeforeLock: 6, bonus: 1 }
		]
	}
};
