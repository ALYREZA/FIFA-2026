import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';

export const STAGE_TYPES = [
	'group',
	'r32',
	'r16',
	'qf',
	'sf',
	'third_place',
	'final'
] as const;

export type StageType = (typeof STAGE_TYPES)[number];

export const MATCH_STATUSES = ['scheduled', 'locked', 'live', 'finished'] as const;
export type MatchStatus = (typeof MATCH_STATUSES)[number];

export const tournaments = sqliteTable('tournaments', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	startsAt: integer('starts_at', { mode: 'timestamp_ms' }).notNull(),
	lockMinutesBeforeKickoff: integer('lock_minutes_before_kickoff').notNull().default(15),
	extrasLockedAt: integer('extras_locked_at', { mode: 'timestamp_ms' }),
	scoringRules: text('scoring_rules', { mode: 'json' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull()
});

export const teams = sqliteTable('teams', {
	id: text('id').primaryKey(),
	tournamentId: text('tournament_id')
		.notNull()
		.references(() => tournaments.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	code: text('code').notNull(),
	flagEmoji: text('flag_emoji'),
	groupId: text('group_id')
});

export const stages = sqliteTable(
	'stages',
	{
		id: text('id').primaryKey(),
		tournamentId: text('tournament_id')
			.notNull()
			.references(() => tournaments.id, { onDelete: 'cascade' }),
		type: text('type').$type<StageType>().notNull(),
		name: text('name').notNull(),
		order: integer('order').notNull(),
		unlockAfterOrder: integer('unlock_after_order'),
		deadlineAt: integer('deadline_at', { mode: 'timestamp_ms' })
	},
	(table) => [index('stages_tournament_idx').on(table.tournamentId)]
);

export const matches = sqliteTable(
	'matches',
	{
		id: text('id').primaryKey(),
		tournamentId: text('tournament_id')
			.notNull()
			.references(() => tournaments.id, { onDelete: 'cascade' }),
		stageId: text('stage_id')
			.notNull()
			.references(() => stages.id, { onDelete: 'cascade' }),
		homeTeamId: text('home_team_id').references(() => teams.id),
		awayTeamId: text('away_team_id').references(() => teams.id),
		groupId: text('group_id'),
		kickoffAt: integer('kickoff_at', { mode: 'timestamp_ms' }).notNull(),
		status: text('status').$type<MatchStatus>().notNull().default('scheduled'),
		homeScore: integer('home_score'),
		awayScore: integer('away_score'),
		winnerTeamId: text('winner_team_id').references(() => teams.id),
		bracketSlot: text('bracket_slot'),
		homeSourceMatchId: text('home_source_match_id'),
		awaySourceMatchId: text('away_source_match_id'),
		winnerAdvancesToMatchId: text('winner_advances_to_match_id'),
		winnerAdvancesAs: text('winner_advances_as').$type<'home' | 'away'>()
	},
	(table) => [
		index('matches_tournament_idx').on(table.tournamentId),
		index('matches_stage_idx').on(table.stageId),
		index('matches_kickoff_idx').on(table.kickoffAt)
	]
);

export const matchPredictions = sqliteTable(
	'match_predictions',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		matchId: text('match_id')
			.notNull()
			.references(() => matches.id, { onDelete: 'cascade' }),
		homeScore: integer('home_score').notNull(),
		awayScore: integer('away_score').notNull(),
		winnerTeamId: text('winner_team_id').references(() => teams.id),
		pointsEarned: integer('points_earned').default(0),
		scoreBreakdown: text('score_breakdown', { mode: 'json' }),
		lockedAt: integer('locked_at', { mode: 'timestamp_ms' }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull()
	},
	(table) => [
		unique('match_predictions_user_match').on(table.userId, table.matchId),
		index('match_predictions_user_idx').on(table.userId)
	]
);

export const groupStandingPredictions = sqliteTable(
	'group_standing_predictions',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		tournamentId: text('tournament_id')
			.notNull()
			.references(() => tournaments.id, { onDelete: 'cascade' }),
		groupId: text('group_id').notNull(),
		teamId: text('team_id')
			.notNull()
			.references(() => teams.id, { onDelete: 'cascade' }),
		predictedPosition: integer('predicted_position').notNull(),
		pointsEarned: integer('points_earned').default(0),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull()
	},
	(table) => [
		unique('group_standing_user_group_team').on(table.userId, table.groupId, table.teamId),
		index('group_standing_user_idx').on(table.userId)
	]
);

export const tournamentExtrasPredictions = sqliteTable(
	'tournament_extras_predictions',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		tournamentId: text('tournament_id')
			.notNull()
			.references(() => tournaments.id, { onDelete: 'cascade' }),
		championTeamId: text('champion_team_id').references(() => teams.id),
		runnerUpTeamId: text('runner_up_team_id').references(() => teams.id),
		topScorerName: text('top_scorer_name'),
		darkHorseTeamId: text('dark_horse_team_id').references(() => teams.id),
		pointsEarned: integer('points_earned').default(0),
		lockedAt: integer('locked_at', { mode: 'timestamp_ms' }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull()
	},
	(table) => [unique('extras_user_tournament').on(table.userId, table.tournamentId)]
);

export const userScores = sqliteTable(
	'user_scores',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		tournamentId: text('tournament_id')
			.notNull()
			.references(() => tournaments.id, { onDelete: 'cascade' }),
		totalPoints: integer('total_points').notNull().default(0),
		matchPoints: integer('match_points').notNull().default(0),
		standingPoints: integer('standing_points').notNull().default(0),
		extrasPoints: integer('extras_points').notNull().default(0),
		exactScores: integer('exact_scores').notNull().default(0),
		correctResults: integer('correct_results').notNull().default(0),
		lastPredictionAt: integer('last_prediction_at', { mode: 'timestamp_ms' }),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull()
	},
	(table) => [unique('user_scores_user_tournament').on(table.userId, table.tournamentId)]
);

export const tournamentsRelations = relations(tournaments, ({ many }) => ({
	teams: many(teams),
	stages: many(stages),
	matches: many(matches)
}));

export const teamsRelations = relations(teams, ({ one }) => ({
	tournament: one(tournaments, {
		fields: [teams.tournamentId],
		references: [tournaments.id]
	})
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
	stage: one(stages, { fields: [matches.stageId], references: [stages.id] }),
	homeTeam: one(teams, { fields: [matches.homeTeamId], references: [teams.id] }),
	awayTeam: one(teams, { fields: [matches.awayTeamId], references: [teams.id] }),
	predictions: many(matchPredictions)
}));

export const matchPredictionsRelations = relations(matchPredictions, ({ one }) => ({
	user: one(user, { fields: [matchPredictions.userId], references: [user.id] }),
	match: one(matches, { fields: [matchPredictions.matchId], references: [matches.id] })
}));
