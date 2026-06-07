import { DEFAULT_SCORING_RULES } from './scoring-rules';

export const COIN_RULES = {
	startingBalance: 1000,
	minimumBalance: 100,
	costs: {
		matchPredict: 10,
		matchEdit: 10,
		groupStandings: 30,
		tournamentExtras: 100,
		knockoutBracketEdit: 20
	},
	podium: {
		maxCost: 200,
		minCost: 40,
		opensDaysBeforeStart: 180
	},
	lateWindowMultipliers: {
		normal: 1,
		lastCall: 2,
		finalWhistle: 5
	},
	lateWindowMinutes: {
		lastCallStart: 15,
		finalWhistleStart: 5,
		hardStop: 1
	},
	earnBack: {
		correctResult: 8,
		exactScore: 25,
		knockoutWinner: 12,
		streakBonus: 20,
		dailyBonus: 15
	},
	maxFinalWhistlePerDay: 3
} as const;

export const USERNAME_RULES = {
	minLength: 3,
	maxLength: 20,
	pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/
} as const;

export const RESERVED_USERNAMES = new Set([
	'admin',
	'api',
	'login',
	'dashboard',
	'leaderboard',
	'predict',
	'rules',
	'system',
	'root',
	'support',
	'podium'
]);

export { DEFAULT_SCORING_RULES };
