import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { matches, stages, teams } from '$lib/server/db/forecast.schema';
import {
	saveActualGroupStandings,
	saveActualTournamentExtras,
	triggerRescoreAll,
	updateMatchResult
} from '$lib/server/forecast/admin-service';
import { reseedTournament, seedTournamentIfNeeded } from '$lib/server/forecast/seed';
import { getActiveTournament } from '$lib/server/forecast/tournament';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform, url }) => {
	const db = getDb(platform!.env.DB);
	await seedTournamentIfNeeded(db);

	const tournament = await getActiveTournament(db);
	if (!tournament) return { tournament: null, matches: [], stages: [] };

	const stageFilter = url.searchParams.get('stage') ?? 'all';
	const [allStages, allMatches, allTeams] = await Promise.all([
		db.select().from(stages).where(eq(stages.tournamentId, tournament.id)),
		db.select().from(matches).where(eq(matches.tournamentId, tournament.id)),
		db.select().from(teams).where(eq(teams.tournamentId, tournament.id))
	]);

	const teamMap = Object.fromEntries(allTeams.map((t) => [t.id, t]));
	const stageMap = Object.fromEntries(allStages.map((s) => [s.id, s]));

	const filtered =
		stageFilter === 'all'
			? allMatches
			: allMatches.filter((m) => m.stageId === stageFilter);

	return {
		tournament,
		stages: allStages.sort((a, b) => a.order - b.order),
		stageFilter,
		matches: filtered
			.sort((a, b) => a.kickoffAt.getTime() - b.kickoffAt.getTime())
			.map((m) => ({
				...m,
				stage: stageMap[m.stageId],
				homeTeam: m.homeTeamId ? teamMap[m.homeTeamId] : null,
				awayTeam: m.awayTeamId ? teamMap[m.awayTeamId] : null
			}))
	};
};

export const actions: Actions = {
	saveResult: async ({ request, platform }) => {
		const db = getDb(platform!.env.DB);
		const form = await request.formData();
		const matchId = form.get('matchId')?.toString();
		const homeScore = Number(form.get('homeScore'));
		const awayScore = Number(form.get('awayScore'));
		const status = (form.get('status')?.toString() ?? 'finished') as
			| 'scheduled'
			| 'live'
			| 'finished';

		if (!matchId || Number.isNaN(homeScore) || Number.isNaN(awayScore)) {
			return fail(400, { error: 'Invalid input' });
		}

		const result = await updateMatchResult(db, matchId, homeScore, awayScore, status);
		if (result.error) return fail(400, { error: result.error.message });

		await triggerRescoreAll(db);
		return { success: true };
	},
	reseed: async ({ platform }) => {
		const db = getDb(platform!.env.DB);
		await reseedTournament(db);
		return { reseeded: true };
	},
	rescore: async ({ platform }) => {
		const db = getDb(platform!.env.DB);
		const result = await triggerRescoreAll(db);
		if (result.error) return fail(400, { error: result.error.message });
		return { usersScored: result.usersScored };
	}
};
