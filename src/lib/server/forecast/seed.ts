import { eq, sql } from 'drizzle-orm';
import type { Database } from '$lib/server/db';
import {
	groupStandingPredictions,
	matchPredictions,
	matches,
	podiumPredictions,
	stages,
	teams,
	tournamentExtrasPredictions,
	tournaments,
	userScores
} from '$lib/server/db/forecast.schema';
import { FIFA_2026_MATCHES } from './data/matches';
import { FIFA_2026_TEAMS } from './data/teams';
import { DEFAULT_SCORING_RULES } from './rules';

export const TOURNAMENT_ID = 'fifa-2026';
export const SEED_VERSION = 4;

const TOURNAMENT_START = new Date(FIFA_2026_MATCHES[0].kickoffAt);
const EXTRAS_LOCK = TOURNAMENT_START;

const STAGE_DEFS = [
	{
		id: 'stage-group',
		type: 'group' as const,
		name: 'Group Stage',
		order: 1,
		unlockAfterOrder: null
	},
	{ id: 'stage-r32', type: 'r32' as const, name: 'Round of 32', order: 2, unlockAfterOrder: 1 },
	{ id: 'stage-r16', type: 'r16' as const, name: 'Round of 16', order: 3, unlockAfterOrder: 2 },
	{ id: 'stage-qf', type: 'qf' as const, name: 'Quarter-finals', order: 4, unlockAfterOrder: 3 },
	{ id: 'stage-sf', type: 'sf' as const, name: 'Semi-finals', order: 5, unlockAfterOrder: 4 },
	{
		id: 'stage-third',
		type: 'third_place' as const,
		name: 'Third-place play-off',
		order: 6,
		unlockAfterOrder: 5
	},
	{ id: 'stage-final', type: 'final' as const, name: 'Final', order: 7, unlockAfterOrder: 5 }
];

function storedSeedVersion(scoringRules: unknown): number {
	if (!scoringRules || typeof scoringRules !== 'object') return 0;
	const version = (scoringRules as { seedVersion?: unknown }).seedVersion;
	return typeof version === 'number' ? version : 0;
}

function matchSeedValues(match: (typeof FIFA_2026_MATCHES)[number]) {
	return {
		id: match.id,
		tournamentId: TOURNAMENT_ID,
		stageId: match.stageId,
		homeTeamId: match.homeTeamId,
		awayTeamId: match.awayTeamId,
		groupId: match.groupId,
		stadiumId: match.stadiumId,
		kickoffAt: new Date(match.kickoffAt),
		status: 'scheduled' as const,
		bracketSlot: match.bracketSlot ?? null,
		homeSourceMatchId: match.homeSourceMatchId ?? null,
		awaySourceMatchId: match.awaySourceMatchId ?? null,
		winnerAdvancesToMatchId: match.winnerAdvancesToMatchId ?? null,
		winnerAdvancesAs: match.winnerAdvancesAs ?? null
	};
}

let seedInFlight: Promise<typeof tournaments.$inferSelect | undefined> | null = null;

export async function seedTournamentIfNeeded(db: Database) {
	if (seedInFlight) return seedInFlight;

	seedInFlight = seedTournamentIfNeededInternal(db).finally(() => {
		seedInFlight = null;
	});

	return seedInFlight;
}

async function seedTournamentIfNeededInternal(db: Database) {
	const [existing] = await db.select().from(tournaments).limit(1);
	if (existing) {
		const needsReseed = storedSeedVersion(existing.scoringRules) < SEED_VERSION;
		const [[{ teamCount }], [{ matchCount }]] = await Promise.all([
			db
				.select({ teamCount: sql<number>`count(*)` })
				.from(teams)
				.where(eq(teams.tournamentId, TOURNAMENT_ID)),
			db
				.select({ matchCount: sql<number>`count(*)` })
				.from(matches)
				.where(eq(matches.tournamentId, TOURNAMENT_ID))
		]);

		const isComplete =
			Number(teamCount) >= FIFA_2026_TEAMS.length && Number(matchCount) >= FIFA_2026_MATCHES.length;

		if (!needsReseed && isComplete) return existing;
		if (!needsReseed && !isComplete) return backfillTournament(db);
		return seedFullTournament(db, true);
	}

	return seedFullTournament(db, false);
}

export async function reseedTournament(db: Database) {
	return seedFullTournament(db, true);
}

async function backfillTournament(db: Database) {
	const existingTeamRows = await db
		.select({ id: teams.id })
		.from(teams)
		.where(eq(teams.tournamentId, TOURNAMENT_ID));
	const existingTeamIds = new Set(existingTeamRows.map((row) => row.id));

	const missingTeams = FIFA_2026_TEAMS.filter((team) => !existingTeamIds.has(team.id));
	if (missingTeams.length > 0) {
		await db
			.insert(teams)
			.values(
				missingTeams.map((team) => ({
					id: team.id,
					tournamentId: TOURNAMENT_ID,
					name: team.name,
					code: team.code,
					flagEmoji: team.flag,
					groupId: team.groupId
				}))
			)
			.onConflictDoNothing();
	}

	const existingStageRows = await db
		.select({ id: stages.id })
		.from(stages)
		.where(eq(stages.tournamentId, TOURNAMENT_ID));
	const existingStageIds = new Set(existingStageRows.map((row) => row.id));

	const missingStages = STAGE_DEFS.filter((stage) => !existingStageIds.has(stage.id));
	if (missingStages.length > 0) {
		await db
			.insert(stages)
			.values(
				missingStages.map((stage) => ({
					id: stage.id,
					tournamentId: TOURNAMENT_ID,
					type: stage.type,
					name: stage.name,
					order: stage.order,
					unlockAfterOrder: stage.unlockAfterOrder,
					deadlineAt: null
				}))
			)
			.onConflictDoNothing();
	}

	const existingMatchRows = await db
		.select({ id: matches.id })
		.from(matches)
		.where(eq(matches.tournamentId, TOURNAMENT_ID));
	const existingMatchIds = new Set(existingMatchRows.map((row) => row.id));

	const missingMatches = FIFA_2026_MATCHES.filter((match) => !existingMatchIds.has(match.id));
	if (missingMatches.length > 0) {
		await db.insert(matches).values(missingMatches.map(matchSeedValues)).onConflictDoNothing();
	}

	const [tournament] = await db
		.select()
		.from(tournaments)
		.where(eq(tournaments.id, TOURNAMENT_ID))
		.limit(1);

	return tournament;
}

async function seedFullTournament(db: Database, force: boolean) {
	if (force) {
		await db.delete(matchPredictions);
		await db.delete(groupStandingPredictions);
		await db.delete(podiumPredictions);
		await db.delete(tournamentExtrasPredictions);
		await db.delete(userScores);
		await db.delete(matches);
		await db.delete(stages);
		await db.delete(teams);
		await db.delete(tournaments).where(eq(tournaments.id, TOURNAMENT_ID));
	}

	const [existing] = await db.select().from(tournaments).limit(1);
	if (existing && !force) return existing;

	await db.insert(tournaments).values({
		id: TOURNAMENT_ID,
		name: 'FIFA World Cup 2026',
		slug: 'fifa-2026',
		startsAt: TOURNAMENT_START,
		lockMinutesBeforeKickoff: 15,
		extrasLockedAt: EXTRAS_LOCK,
		scoringRules: { ...DEFAULT_SCORING_RULES, seedVersion: SEED_VERSION }
	});

	await db.insert(teams).values(
		FIFA_2026_TEAMS.map((team) => ({
			id: team.id,
			tournamentId: TOURNAMENT_ID,
			name: team.name,
			code: team.code,
			flagEmoji: team.flag,
			groupId: team.groupId
		}))
	);

	await db.insert(stages).values(
		STAGE_DEFS.map((stage) => ({
			id: stage.id,
			tournamentId: TOURNAMENT_ID,
			type: stage.type,
			name: stage.name,
			order: stage.order,
			unlockAfterOrder: stage.unlockAfterOrder,
			deadlineAt: null
		}))
	);

	await db.insert(matches).values(FIFA_2026_MATCHES.map(matchSeedValues));

	const [tournament] = await db
		.select()
		.from(tournaments)
		.where(eq(tournaments.id, TOURNAMENT_ID))
		.limit(1);

	return tournament;
}
