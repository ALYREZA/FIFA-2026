import { and, eq } from 'drizzle-orm';
import type { Database } from '$lib/server/db';
import {
	actualGroupStandings,
	actualTournamentExtras,
	matches,
	type MatchStatus
} from '$lib/server/db/forecast.schema';
import { getWinnerTeamId } from './rules/knockout';
import { scoreAllUsers } from './scoring-service';
import { getActiveTournament } from './tournament';

export async function updateMatchResult(
	db: Database,
	matchId: string,
	homeScore: number,
	awayScore: number,
	status: MatchStatus = 'finished'
) {
	const [match] = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
	if (!match) return { error: { code: 'not_found', message: 'Match not found' } };

	const winnerTeamId = getWinnerTeamId(
		match.homeTeamId,
		match.awayTeamId,
		homeScore,
		awayScore
	);

	await db
		.update(matches)
		.set({
			homeScore,
			awayScore,
			winnerTeamId,
			status
		})
		.where(eq(matches.id, matchId));

	return { success: true };
}

export async function saveActualGroupStandings(
	db: Database,
	standings: { groupId: string; teamId: string; actualPosition: number }[]
) {
	const tournament = await getActiveTournament(db);
	if (!tournament) return { error: { code: 'no_tournament', message: 'No tournament' } };

	for (const row of standings) {
		const [existing] = await db
			.select()
			.from(actualGroupStandings)
			.where(
				and(
					eq(actualGroupStandings.tournamentId, tournament.id),
					eq(actualGroupStandings.groupId, row.groupId),
					eq(actualGroupStandings.teamId, row.teamId)
				)
			)
			.limit(1);

		if (existing) {
			await db
				.update(actualGroupStandings)
				.set({ actualPosition: row.actualPosition, updatedAt: new Date() })
				.where(eq(actualGroupStandings.id, existing.id));
		} else {
			await db.insert(actualGroupStandings).values({
				id: crypto.randomUUID(),
				tournamentId: tournament.id,
				groupId: row.groupId,
				teamId: row.teamId,
				actualPosition: row.actualPosition
			});
		}
	}

	return { success: true };
}

export async function saveActualTournamentExtras(
	db: Database,
	extras: {
		championTeamId: string | null;
		runnerUpTeamId: string | null;
		topScorerName: string | null;
		darkHorseTeamId: string | null;
	}
) {
	const tournament = await getActiveTournament(db);
	if (!tournament) return { error: { code: 'no_tournament', message: 'No tournament' } };

	const [existing] = await db
		.select()
		.from(actualTournamentExtras)
		.where(eq(actualTournamentExtras.tournamentId, tournament.id))
		.limit(1);

	const now = new Date();

	if (existing) {
		await db
			.update(actualTournamentExtras)
			.set({ ...extras, updatedAt: now })
			.where(eq(actualTournamentExtras.id, existing.id));
	} else {
		await db.insert(actualTournamentExtras).values({
			id: crypto.randomUUID(),
			tournamentId: tournament.id,
			...extras
		});
	}

	return { success: true };
}

export async function triggerRescoreAll(db: Database) {
	const tournament = await getActiveTournament(db);
	if (!tournament) return { error: { code: 'no_tournament', message: 'No tournament' } };

	const count = await scoreAllUsers(db, tournament.id);
	return { success: true, usersScored: count };
}

export async function getActualGroupStandings(db: Database, tournamentId: string) {
	return db
		.select()
		.from(actualGroupStandings)
		.where(eq(actualGroupStandings.tournamentId, tournamentId));
}

export async function getActualTournamentExtras(db: Database, tournamentId: string) {
	const [extras] = await db
		.select()
		.from(actualTournamentExtras)
		.where(eq(actualTournamentExtras.tournamentId, tournamentId))
		.limit(1);
	return extras ?? null;
}
