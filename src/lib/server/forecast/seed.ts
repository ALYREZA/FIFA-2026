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
import { FIFA_2026_GROUPS, FIFA_2026_TEAMS, GROUP_ROUND_ROBIN } from './data/teams';
import { buildKnockoutBracket } from './data/knockout-bracket';
import { DEFAULT_SCORING_RULES } from './rules';

export const TOURNAMENT_ID = 'fifa-2026';
export const SEED_VERSION = 2;

const TOURNAMENT_START = new Date('2026-06-11T17:00:00Z');
const EXTRAS_LOCK = new Date('2026-06-11T17:00:00Z');

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

function addDays(base: Date, days: number, hour = 18): Date {
	const d = new Date(base);
	d.setUTCDate(d.getUTCDate() + days);
	d.setUTCHours(hour, 0, 0, 0);
	return d;
}

export async function seedTournamentIfNeeded(db: Database) {
	const [existing] = await db.select().from(tournaments).limit(1);
	if (existing) {
		const [{ count }] = await db
			.select({ count: sql<number>`count(*)` })
			.from(teams)
			.where(eq(teams.tournamentId, TOURNAMENT_ID));
		if (Number(count) >= 48) return existing;
		return seedFullTournament(db, true);
	}

	return seedFullTournament(db, false);
}

export async function reseedTournament(db: Database) {
	return seedFullTournament(db, true);
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

	for (const team of FIFA_2026_TEAMS) {
		await db.insert(teams).values({
			id: team.id,
			tournamentId: TOURNAMENT_ID,
			name: team.name,
			code: team.code,
			flagEmoji: team.flag,
			groupId: team.groupId
		});
	}

	for (const stage of STAGE_DEFS) {
		await db.insert(stages).values({
			id: stage.id,
			tournamentId: TOURNAMENT_ID,
			type: stage.type,
			name: stage.name,
			order: stage.order,
			unlockAfterOrder: stage.unlockAfterOrder,
			deadlineAt: null
		});
	}

	let groupMatchIndex = 0;
	const groupLetters = Object.keys(FIFA_2026_GROUPS).sort();

	for (const groupId of groupLetters) {
		const groupTeams = FIFA_2026_GROUPS[groupId];
		const groupOffset = groupLetters.indexOf(groupId);

		for (let md = 0; md < GROUP_ROUND_ROBIN.length; md++) {
			const [hi, ai, hj, aj] = GROUP_ROUND_ROBIN[md];
			const day = Math.floor(groupMatchIndex / 6) + md * 5 + Math.floor(groupOffset / 3);
			const kickoff = addDays(TOURNAMENT_START, day, 14 + (groupMatchIndex % 3) * 4);

			await db.insert(matches).values({
				id: `m-${groupId.toLowerCase()}${md * 2 + 1}`,
				tournamentId: TOURNAMENT_ID,
				stageId: 'stage-group',
				homeTeamId: groupTeams[hi].id,
				awayTeamId: groupTeams[ai].id,
				groupId,
				kickoffAt: kickoff,
				status: 'scheduled'
			});

			const kickoff2 = addDays(kickoff, 0, kickoff.getUTCHours() + 2);
			await db.insert(matches).values({
				id: `m-${groupId.toLowerCase()}${md * 2 + 2}`,
				tournamentId: TOURNAMENT_ID,
				stageId: 'stage-group',
				homeTeamId: groupTeams[hj].id,
				awayTeamId: groupTeams[aj].id,
				groupId,
				kickoffAt: kickoff2,
				status: 'scheduled'
			});

			groupMatchIndex += 2;
		}
	}

	const bracket = buildKnockoutBracket();
	let knockoutDay = 17;

	async function insertKnockout(
		id: string,
		stageId: string,
		opts: {
			homeSourceMatchId?: string;
			awaySourceMatchId?: string;
			winnerAdvancesToMatchId?: string;
			winnerAdvancesAs?: 'home' | 'away';
			dayOffset: number;
		}
	) {
		await db.insert(matches).values({
			id,
			tournamentId: TOURNAMENT_ID,
			stageId,
			homeTeamId: null,
			awayTeamId: null,
			kickoffAt: addDays(TOURNAMENT_START, opts.dayOffset),
			status: 'scheduled',
			homeSourceMatchId: opts.homeSourceMatchId ?? null,
			awaySourceMatchId: opts.awaySourceMatchId ?? null,
			winnerAdvancesToMatchId: opts.winnerAdvancesToMatchId ?? null,
			winnerAdvancesAs: opts.winnerAdvancesAs ?? null
		});
	}

	for (const [i, link] of bracket.r32.entries()) {
		await insertKnockout(link.id, 'stage-r32', {
			winnerAdvancesToMatchId: link.winnerAdvancesToId,
			winnerAdvancesAs: link.winnerAdvancesAs,
			dayOffset: knockoutDay + Math.floor(i / 4)
		});
	}

	knockoutDay += 4;
	for (const [i, link] of bracket.r16.entries()) {
		await insertKnockout(link.id, 'stage-r16', {
			homeSourceMatchId: link.homeSourceId,
			awaySourceMatchId: link.awaySourceId,
			winnerAdvancesToMatchId: link.winnerAdvancesToId,
			winnerAdvancesAs: link.winnerAdvancesAs,
			dayOffset: knockoutDay + Math.floor(i / 2)
		});
	}

	knockoutDay += 3;
	for (const [i, link] of bracket.qf.entries()) {
		await insertKnockout(link.id, 'stage-qf', {
			homeSourceMatchId: link.homeSourceId,
			awaySourceMatchId: link.awaySourceId,
			winnerAdvancesToMatchId: link.winnerAdvancesToId,
			winnerAdvancesAs: link.winnerAdvancesAs,
			dayOffset: knockoutDay + i
		});
	}

	knockoutDay += 3;
	for (const link of bracket.sf) {
		await insertKnockout(link.id, 'stage-sf', {
			homeSourceMatchId: link.homeSourceId,
			awaySourceMatchId: link.awaySourceId,
			winnerAdvancesToMatchId: link.winnerAdvancesToId,
			winnerAdvancesAs: link.winnerAdvancesAs,
			dayOffset: knockoutDay
		});
		knockoutDay++;
	}

	// Third-place: teams set by admin after semi-finals (losers, not bracket winners)
	await insertKnockout(bracket.thirdPlace.id, 'stage-third', {
		dayOffset: knockoutDay + 1
	});

	await insertKnockout(bracket.final.id, 'stage-final', {
		homeSourceMatchId: bracket.final.homeSourceId,
		awaySourceMatchId: bracket.final.awaySourceId,
		dayOffset: knockoutDay + 5
	});

	const [tournament] = await db
		.select()
		.from(tournaments)
		.where(eq(tournaments.id, TOURNAMENT_ID))
		.limit(1);

	return tournament;
}
