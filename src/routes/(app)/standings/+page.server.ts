import { fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { seedTournamentIfNeeded } from '$lib/server/forecast/seed';
import {
	getUserGroupStandings,
	submitGroupStandings
} from '$lib/server/forecast/predictions';
import { getActiveTournament, getTournamentTeams } from '$lib/server/forecast/tournament';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform }) => {
	const db = getDb(platform!.env.DB);
	await seedTournamentIfNeeded(db);

	const tournament = await getActiveTournament(db);
	if (!tournament) return { tournament: null, groups: [] };

	const userId = locals.user!.id;
	const [teams, standings] = await Promise.all([
		getTournamentTeams(db, tournament.id),
		getUserGroupStandings(db, userId, tournament.id)
	]);

	const groups = [...new Set(teams.map((t) => t.groupId).filter(Boolean))].sort() as string[];
	const standingMap = Object.fromEntries(
		standings.map((s) => [`${s.groupId}:${s.teamId}`, s.predictedPosition])
	);

	return {
		tournament,
		groups: groups.map((groupId) => ({
			id: groupId,
			teams: teams
				.filter((t) => t.groupId === groupId)
				.map((t) => ({
					...t,
					predictedPosition: standingMap[`${groupId}:${t.id}`] ?? null
				}))
		})),
		extrasLocked: tournament.extrasLockedAt ? new Date() >= tournament.extrasLockedAt : false
	};
};

export const actions: Actions = {
	save: async ({ request, locals, platform }) => {
		const db = getDb(platform!.env.DB);
		const form = await request.formData();
		const raw = form.get('predictions')?.toString();

		if (!raw) return fail(400, { error: 'No predictions provided' });

		let predictions: { groupId: string; teamId: string; predictedPosition: number }[];
		try {
			predictions = JSON.parse(raw);
		} catch {
			return fail(400, { error: 'Invalid data' });
		}

		const result = await submitGroupStandings(db, locals.user!.id, predictions);
		if (result.error) return fail(400, { error: result.error.message });

		return { success: true };
	}
};
