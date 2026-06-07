import { fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { seedTournamentIfNeeded } from '$lib/server/forecast/seed';
import { getUserExtras, submitTournamentExtras } from '$lib/server/forecast/predictions';
import { getActiveTournament, getTournamentTeams } from '$lib/server/forecast/tournament';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform }) => {
	const db = getDb(platform!.env.DB);
	await seedTournamentIfNeeded(db);

	const tournament = await getActiveTournament(db);
	if (!tournament) return { tournament: null, teams: [], extras: null };

	const userId = locals.user!.id;
	const [teams, extras] = await Promise.all([
		getTournamentTeams(db, tournament.id),
		getUserExtras(db, userId, tournament.id)
	]);

	return {
		tournament,
		teams,
		extras,
		locked: tournament.extrasLockedAt ? new Date() >= tournament.extrasLockedAt : false
	};
};

export const actions: Actions = {
	save: async ({ request, locals, platform }) => {
		const db = getDb(platform!.env.DB);
		const form = await request.formData();

		const result = await submitTournamentExtras(db, locals.user!.id, {
			championTeamId: form.get('championTeamId')?.toString() || null,
			runnerUpTeamId: form.get('runnerUpTeamId')?.toString() || null,
			topScorerName: form.get('topScorerName')?.toString() || null,
			darkHorseTeamId: form.get('darkHorseTeamId')?.toString() || null
		});

		if (result.error) return fail(400, { error: result.error.message });
		return { success: true };
	}
};
