import { getDb } from '$lib/server/db';
import { seedTournamentIfNeeded } from '$lib/server/forecast/seed';
import { getUserPredictionsMap } from '$lib/server/forecast/predictions';
import {
	getActiveTournament,
	getTournamentMatches,
	getTournamentStages,
	getTournamentTeams
} from '$lib/server/forecast/tournament';
import { resolveBracketTeams, type BracketMatch } from '$lib/server/forecast/rules/bracket';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform }) => {
	const db = getDb(platform!.env.DB);
	await seedTournamentIfNeeded(db);

	const tournament = await getActiveTournament(db);
	if (!tournament) return { tournament: null, bracket: [] };

	const userId = locals.user!.id;
	const [teams, stages, matches, predictions] = await Promise.all([
		getTournamentTeams(db, tournament.id),
		getTournamentStages(db, tournament.id),
		getTournamentMatches(db, tournament.id),
		getUserPredictionsMap(db, userId, tournament.id)
	]);

	const knockoutStages = stages.filter((s) => s.type !== 'group');
	const stageOrderMap = new Map(stages.map((s) => [s.id, s.order]));
	const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

	const knockoutMatches = matches.filter((m) =>
		knockoutStages.some((s) => s.id === m.stageId)
	);

	const bracketMatches: BracketMatch[] = knockoutMatches.map((m) => ({
		id: m.id,
		homeTeamId: m.homeTeamId,
		awayTeamId: m.awayTeamId,
		homeSourceMatchId: m.homeSourceMatchId,
		awaySourceMatchId: m.awaySourceMatchId,
		winnerAdvancesToMatchId: m.winnerAdvancesToMatchId,
		winnerAdvancesAs: m.winnerAdvancesAs,
		stageOrder: stageOrderMap.get(m.stageId) ?? 0
	}));

	const resolved = resolveBracketTeams(bracketMatches, predictions);

	const bracket = knockoutMatches.map((match) => {
		const stage = stages.find((s) => s.id === match.stageId)!;
		const resolvedTeams = resolved[match.id];
		const prediction = predictions[match.id];

		return {
			id: match.id,
			stageName: stage.name,
			homeTeam: resolvedTeams?.homeTeamId ? teamMap[resolvedTeams.homeTeamId] : null,
			awayTeam: resolvedTeams?.awayTeamId ? teamMap[resolvedTeams.awayTeamId] : null,
			prediction: prediction ?? null,
			kickoffAt: match.kickoffAt
		};
	});

	return { tournament, bracket };
};
