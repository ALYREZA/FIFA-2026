import { fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import {
	getActualGroupStandings,
	getActualTournamentExtras,
	saveActualGroupStandings,
	saveActualTournamentExtras,
	triggerRescoreAll
} from '$lib/server/forecast/admin-service';
import { seedTournamentIfNeeded } from '$lib/server/forecast/seed';
import { getActiveTournament, getTournamentTeams } from '$lib/server/forecast/tournament';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDb(platform!.env.DB);
	await seedTournamentIfNeeded(db);

	const tournament = await getActiveTournament(db);
	if (!tournament) return { tournament: null, groups: [], extras: null };

	const [teams, actualStandings, actualExtras] = await Promise.all([
		getTournamentTeams(db, tournament.id),
		getActualGroupStandings(db, tournament.id),
		getActualTournamentExtras(db, tournament.id)
	]);

	const standingMap = Object.fromEntries(
		actualStandings.map((s) => [`${s.groupId}:${s.teamId}`, s.actualPosition])
	);

	const groups = [...new Set(teams.map((t) => t.groupId).filter(Boolean))].sort() as string[];

	return {
		tournament,
		groups: groups.map((groupId) => ({
			id: groupId,
			teams: teams
				.filter((t) => t.groupId === groupId)
				.map((t) => ({
					...t,
					actualPosition: standingMap[`${groupId}:${t.id}`] ?? null
				}))
		})),
		extras: actualExtras
	};
};

export const actions: Actions = {
	saveStandings: async ({ request, platform }) => {
		const db = getDb(platform!.env.DB);
		const form = await request.formData();
		const raw = form.get('standings')?.toString();

		if (!raw) return fail(400, { error: 'No data' });

		const standings = JSON.parse(raw) as {
			groupId: string;
			teamId: string;
			actualPosition: number;
		}[];

		const result = await saveActualGroupStandings(db, standings);
		if (result.error) return fail(400, { error: result.error.message });

		await triggerRescoreAll(db);
		return { success: true };
	},
	saveExtras: async ({ request, platform }) => {
		const db = getDb(platform!.env.DB);
		const form = await request.formData();

		const result = await saveActualTournamentExtras(db, {
			championTeamId: form.get('championTeamId')?.toString() || null,
			runnerUpTeamId: form.get('runnerUpTeamId')?.toString() || null,
			thirdPlaceTeamId: form.get('thirdPlaceTeamId')?.toString() || null,
			topScorerName: form.get('topScorerName')?.toString() || null,
			darkHorseTeamId: form.get('darkHorseTeamId')?.toString() || null
		});

		if (result.error) return fail(400, { error: result.error.message });

		await triggerRescoreAll(db);
		return { success: true };
	}
};
