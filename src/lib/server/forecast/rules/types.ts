import type { ScoringRules } from '$lib/forecast/scoring-rules';
import type { MatchStatus, StageType } from '$lib/server/db/forecast.schema';

export type { ScoringRules };
export { DEFAULT_SCORING_RULES } from '$lib/forecast/scoring-rules';

export type ScoreBreakdown = {
	exactScore?: number;
	correctResult?: number;
	correctGoalDiff?: number;
	correctWinner?: number;
	earlyBonus?: number;
	positionExact?: number;
	positionOffByOne?: number;
	champion?: number;
	runnerUp?: number;
	topScorer?: number;
	darkHorse?: number;
	podiumFirst?: number;
	podiumSecond?: number;
	podiumThird?: number;
	total: number;
};

export type MatchContext = {
	id: string;
	stageType: StageType;
	kickoffAt: Date;
	status: MatchStatus;
	homeTeamId: string | null;
	awayTeamId: string | null;
	lockMinutesBeforeKickoff: number;
};

export type MatchResult = {
	homeScore: number;
	awayScore: number;
	winnerTeamId: string | null;
};

export type MatchPredictionInput = {
	homeScore: number;
	awayScore: number;
};

export type BracketPredictionMap = Record<string, string | null>;

export type StageContext = {
	type: StageType;
	order: number;
	unlockAfterOrder: number | null;
	deadlineAt: Date | null;
};

export type GroupStandingInput = {
	groupId: string;
	teamId: string;
	predictedPosition: number;
};

export type GroupStandingResult = {
	groupId: string;
	teamId: string;
	actualPosition: number;
};

export type TournamentExtrasInput = {
	championTeamId: string | null;
	runnerUpTeamId: string | null;
	topScorerName: string | null;
	darkHorseTeamId: string | null;
};

export type TournamentExtrasResult = {
	championTeamId: string | null;
	runnerUpTeamId: string | null;
	thirdPlaceTeamId?: string | null;
	topScorerName: string | null;
	darkHorseTeamId: string | null;
};

export type ValidationError = {
	code: string;
	message: string;
};
