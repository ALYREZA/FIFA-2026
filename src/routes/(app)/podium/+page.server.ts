import { fail } from '@sveltejs/kit';
import { COIN_RULES } from '$lib/forecast/game-rules';
import { getDb } from '$lib/server/db';
import { seedTournamentIfNeeded } from '$lib/server/forecast/seed';
import {
	getPodiumPricing,
	getUserPodium,
	submitPodiumPrediction
} from '$lib/server/forecast/predictions';
import { getActiveTournament, getTournamentTeams } from '$lib/server/forecast/tournament';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform }) => {
	const db = getDb(platform!.env.DB);
	await seedTournamentIfNeeded(db);

	const tournament = await getActiveTournament(db);
	if (!tournament) {
		return { tournament: null, teams: [], podium: null, pricing: null };
	}

	const userId = locals.user!.id;
	const [teams, podium, pricing] = await Promise.all([
		getTournamentTeams(db, tournament.id),
		getUserPodium(db, userId, tournament.id),
		getPodiumPricing(db, userId, tournament.id)
	]);

	return {
		tournament,
		teams,
		podium,
		pricing,
		maxCoinCost: COIN_RULES.podium.maxCost,
		minCoinCost: COIN_RULES.podium.minCost
	};
};

export const actions: Actions = {
	submit: async ({ request, locals, platform }) => {
		const db = getDb(platform!.env.DB);
		const form = await request.formData();

		const result = await submitPodiumPrediction(db, locals.user!.id, {
			firstPlaceTeamId: form.get('firstPlaceTeamId')?.toString() ?? '',
			secondPlaceTeamId: form.get('secondPlaceTeamId')?.toString() ?? '',
			thirdPlaceTeamId: form.get('thirdPlaceTeamId')?.toString() ?? ''
		});

		if (result.error) return fail(400, { error: result.error.message });
		return { success: true, coinsSpent: result.coinsSpent };
	}
};
