import { eq } from 'drizzle-orm';
import type { Database } from '$lib/server/db';
import { matches, stages, teams, tournaments } from '$lib/server/db/forecast.schema';
import { DEFAULT_SCORING_RULES } from './rules';

const TOURNAMENT_ID = 'fifa-2026';

const GROUP_A_TEAMS = [
	{ id: 'mex', name: 'Mexico', code: 'MEX', flag: '🇲🇽' },
	{ id: 'rsa', name: 'South Africa', code: 'RSA', flag: '🇿🇦' },
	{ id: 'kor', name: 'South Korea', code: 'KOR', flag: '🇰🇷' },
	{ id: 'den', name: 'Denmark', code: 'DEN', flag: '🇩🇰' }
];

const GROUP_B_TEAMS = [
	{ id: 'can', name: 'Canada', code: 'CAN', flag: '🇨🇦' },
	{ id: 'qat', name: 'Qatar', code: 'QAT', flag: '🇶🇦' },
	{ id: 'sui', name: 'Switzerland', code: 'SUI', flag: '🇨🇭' },
	{ id: 'bra', name: 'Brazil', code: 'BRA', flag: '🇧🇷' }
];

export async function seedTournamentIfNeeded(db: Database) {
	const [existing] = await db.select().from(tournaments).limit(1);
	if (existing) return existing;

	const tournamentStart = new Date('2026-06-11T00:00:00Z');
	const extrasLock = new Date('2026-06-11T00:00:00Z');

	await db.insert(tournaments).values({
		id: TOURNAMENT_ID,
		name: 'FIFA World Cup 2026',
		slug: 'fifa-2026',
		startsAt: tournamentStart,
		lockMinutesBeforeKickoff: 15,
		extrasLockedAt: extrasLock,
		scoringRules: DEFAULT_SCORING_RULES
	});

	const allTeams = [
		...GROUP_A_TEAMS.map((t) => ({ ...t, groupId: 'A' })),
		...GROUP_B_TEAMS.map((t) => ({ ...t, groupId: 'B' }))
	];

	for (const team of allTeams) {
		await db.insert(teams).values({
			id: team.id,
			tournamentId: TOURNAMENT_ID,
			name: team.name,
			code: team.code,
			flagEmoji: team.flag,
			groupId: team.groupId
		});
	}

	const stageDefs = [
		{ id: 'stage-group', type: 'group' as const, name: 'Group Stage', order: 1, unlockAfterOrder: null },
		{ id: 'stage-r32', type: 'r32' as const, name: 'Round of 32', order: 2, unlockAfterOrder: 1 },
		{ id: 'stage-r16', type: 'r16' as const, name: 'Round of 16', order: 3, unlockAfterOrder: 2 },
		{ id: 'stage-qf', type: 'qf' as const, name: 'Quarter-finals', order: 4, unlockAfterOrder: 3 },
		{ id: 'stage-sf', type: 'sf' as const, name: 'Semi-finals', order: 5, unlockAfterOrder: 4 },
		{ id: 'stage-final', type: 'final' as const, name: 'Final', order: 6, unlockAfterOrder: 5 }
	];

	for (const stage of stageDefs) {
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

	const groupMatches = [
		{ id: 'm-a1', groupId: 'A', home: 'mex', away: 'rsa', day: 0 },
		{ id: 'm-a2', groupId: 'A', home: 'kor', away: 'den', day: 1 },
		{ id: 'm-a3', groupId: 'A', home: 'mex', away: 'kor', day: 5 },
		{ id: 'm-a4', groupId: 'A', home: 'rsa', away: 'den', day: 6 },
		{ id: 'm-b1', groupId: 'B', home: 'can', away: 'qat', day: 0 },
		{ id: 'm-b2', groupId: 'B', home: 'sui', away: 'bra', day: 1 },
		{ id: 'm-b3', groupId: 'B', home: 'can', away: 'sui', day: 5 },
		{ id: 'm-b4', groupId: 'B', home: 'qat', away: 'bra', day: 6 }
	];

	for (const gm of groupMatches) {
		const kickoff = new Date(tournamentStart);
		kickoff.setDate(kickoff.getDate() + gm.day);
		kickoff.setHours(18, 0, 0, 0);

		await db.insert(matches).values({
			id: gm.id,
			tournamentId: TOURNAMENT_ID,
			stageId: 'stage-group',
			homeTeamId: gm.home,
			awayTeamId: gm.away,
			groupId: gm.groupId,
			kickoffAt: kickoff,
			status: 'scheduled'
		});
	}

	const r32Kickoff = new Date(tournamentStart);
	r32Kickoff.setDate(r32Kickoff.getDate() + 14);

	await db.insert(matches).values({
		id: 'm-r32-1',
		tournamentId: TOURNAMENT_ID,
		stageId: 'stage-r32',
		homeTeamId: null,
		awayTeamId: null,
		kickoffAt: r32Kickoff,
		status: 'scheduled',
		homeSourceMatchId: 'm-a1',
		awaySourceMatchId: 'm-b1',
		winnerAdvancesToMatchId: 'm-r16-1',
		winnerAdvancesAs: 'home'
	});

	const r16Kickoff = new Date(r32Kickoff);
	r16Kickoff.setDate(r16Kickoff.getDate() + 4);

	await db.insert(matches).values({
		id: 'm-r16-1',
		tournamentId: TOURNAMENT_ID,
		stageId: 'stage-r16',
		homeTeamId: null,
		awayTeamId: 'bra',
		kickoffAt: r16Kickoff,
		status: 'scheduled',
		awaySourceMatchId: null,
		winnerAdvancesToMatchId: 'm-final-1',
		winnerAdvancesAs: 'home'
	});

	const finalKickoff = new Date(r16Kickoff);
	finalKickoff.setDate(finalKickoff.getDate() + 10);

	await db.insert(matches).values({
		id: 'm-final-1',
		tournamentId: TOURNAMENT_ID,
		stageId: 'stage-final',
		homeTeamId: null,
		awayTeamId: null,
		kickoffAt: finalKickoff,
		status: 'scheduled'
	});

	const [tournament] = await db
		.select()
		.from(tournaments)
		.where(eq(tournaments.id, TOURNAMENT_ID))
		.limit(1);

	return tournament;
}
