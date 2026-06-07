export type ScoringRules = {
	group: { exactScore: number; correctResult: number; correctGoalDiff: number };
	knockout: { correctWinner: number; exactScoreBonus: number };
	standings: { positionExact: number; positionOffByOne: number };
	extras: { champion: number; runnerUp: number; topScorer: number; darkHorse: number };
};

export const DEFAULT_SCORING_RULES: ScoringRules = {
	group: { exactScore: 5, correctResult: 2, correctGoalDiff: 1 },
	knockout: { correctWinner: 3, exactScoreBonus: 2 },
	standings: { positionExact: 4, positionOffByOne: 2 },
	extras: { champion: 10, runnerUp: 5, topScorer: 8, darkHorse: 6 }
};
