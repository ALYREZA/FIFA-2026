import { fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { seedTournamentIfNeeded } from '$lib/server/forecast/seed';
import { submitMatchPrediction, getUserPredictionsMap } from '$lib/server/forecast/predictions';
import {
	getActiveTournament,
	getCompletedStageOrders,
	getTournamentMatches,
	getTournamentStages,
	getTournamentTeams
} from '$lib/server/forecast/tournament';
import { isMatchLocked, getPredictionLockTime } from '$lib/server/forecast/rules';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform }) => {
	const db = getDb(platform!.env.DB);
	await seedTournamentIfNeeded(db);

	const tournament = await getActiveTournament(db);
	if (!tournament) return { tournament: null, stages: [], matches: [] };

	const userId = locals.user!.id;
	const [teams, stages, matches, predictions, completedOrders] = await Promise.all([
		getTournamentTeams(db, tournament.id),
		getTournamentStages(db, tournament.id),
		getTournamentMatches(db, tournament.id),
		getUserPredictionsMap(db, userId, tournament.id),
		getCompletedStageOrders(db, tournament.id)
	]);

	const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));
	const stageMap = Object.fromEntries(stages.map((s) => [s.id, s]));
	const now = new Date();

	const enriched = matches.map((match) => {
		const stage = stageMap[match.stageId];
		const prediction = predictions[match.id];
		const matchCtx = {
			id: match.id,
			stageType: stage.type,
			kickoffAt: match.kickoffAt,
			status: match.status,
			homeTeamId: match.homeTeamId,
			awayTeamId: match.awayTeamId,
			lockMinutesBeforeKickoff: tournament.lockMinutesBeforeKickoff
		};

		return {
			...match,
			stage,
			homeTeam: match.homeTeamId ? teamMap[match.homeTeamId] : null,
			awayTeam: match.awayTeamId ? teamMap[match.awayTeamId] : null,
			prediction: prediction ?? null,
			locked: isMatchLocked(matchCtx, now),
			lockAt: getPredictionLockTime(matchCtx),
			stageUnlocked:
				stage.unlockAfterOrder === null ||
				completedOrders.includes(stage.unlockAfterOrder)
		};
	});

	return {
		tournament,
		stages,
		matches: enriched
	};
};

export const actions: Actions = {
	predict: async ({ request, locals, platform }) => {
		const db = getDb(platform!.env.DB);
		const form = await request.formData();
		const matchId = form.get('matchId')?.toString();
		const homeScore = Number(form.get('homeScore'));
		const awayScore = Number(form.get('awayScore'));

		if (!matchId || Number.isNaN(homeScore) || Number.isNaN(awayScore)) {
			return fail(400, { error: 'Invalid input' });
		}

		const result = await submitMatchPrediction(db, locals.user!.id, matchId, {
			homeScore,
			awayScore
		});

		if (result.error) {
			return fail(400, { error: result.error.message });
		}

		return { success: true };
	}
};
