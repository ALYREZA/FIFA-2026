import { and, eq } from 'drizzle-orm';
import type { Database } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';
import { userScores } from '$lib/server/db/forecast.schema';
import {
	getUserExtras,
	getUserGroupStandings,
	getUserPodium,
	getUserPredictionsMap
} from '$lib/server/forecast/predictions';
import { resolveBracketTeams, type BracketMatch } from '$lib/server/forecast/rules/bracket';
import {
	getActiveTournament,
	getTournamentMatches,
	getTournamentStages,
	getTournamentTeams
} from '$lib/server/forecast/tournament';
import { getUserByUsername } from '$lib/server/user';

export async function getPublicUserProfile(db: Database, username: string) {
	const profileUser = await getUserByUsername(db, username);
	if (!profileUser) return null;

	const tournament = await getActiveTournament(db);
	if (!tournament) {
		return {
			user: profileUser,
			tournament: null,
			score: null,
			matches: [],
			groups: [],
			extras: null,
			podium: null,
			bracket: []
		};
	}

	const userId = profileUser.id;
	const [teams, stages, matches, predictions, standings, extras, podium, scoreRows] =
		await Promise.all([
			getTournamentTeams(db, tournament.id),
			getTournamentStages(db, tournament.id),
			getTournamentMatches(db, tournament.id),
			getUserPredictionsMap(db, userId, tournament.id),
			getUserGroupStandings(db, userId, tournament.id),
			getUserExtras(db, userId, tournament.id),
			getUserPodium(db, userId, tournament.id),
			db
				.select()
				.from(userScores)
				.where(and(eq(userScores.userId, userId), eq(userScores.tournamentId, tournament.id)))
				.limit(1)
		]);

	const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));
	const stageMap = Object.fromEntries(stages.map((s) => [s.id, s]));
	const groupIds = [...new Set(teams.map((t) => t.groupId).filter(Boolean))].sort() as string[];

	const extrasDisplay = extras
		? {
				champion: extras.championTeamId ? teamMap[extras.championTeamId] : null,
				runnerUp: extras.runnerUpTeamId ? teamMap[extras.runnerUpTeamId] : null,
				topScorerName: extras.topScorerName,
				darkHorse: extras.darkHorseTeamId ? teamMap[extras.darkHorseTeamId] : null
			}
		: null;

	const podiumDisplay = podium
		? {
				first: teamMap[podium.firstPlaceTeamId] ?? null,
				second: teamMap[podium.secondPlaceTeamId] ?? null,
				third: teamMap[podium.thirdPlaceTeamId] ?? null,
				coinsSpent: podium.coinsSpent
			}
		: null;

	const matchPredictions = matches
		.filter((match) => predictions[match.id])
		.map((match) => {
			const stage = stageMap[match.stageId];
			const prediction = predictions[match.id]!;

			return {
				id: match.id,
				stageName: stage.name,
				stageOrder: stage.order,
				kickoffAt: match.kickoffAt,
				homeTeam: match.homeTeamId ? teamMap[match.homeTeamId] : null,
				awayTeam: match.awayTeamId ? teamMap[match.awayTeamId] : null,
				prediction
			};
		})
		.sort((a, b) => a.kickoffAt.getTime() - b.kickoffAt.getTime());

	const groups = groupIds.map((groupId) => ({
		id: groupId,
		teams: teams
			.filter((team) => team.groupId === groupId)
			.map((team) => ({
				...team,
				predictedPosition:
					standings.find((row) => row.groupId === groupId && row.teamId === team.id)
						?.predictedPosition ?? null
			}))
	}));

	const knockoutStages = stages.filter((stage) => stage.type !== 'group');
	const stageOrderMap = new Map(stages.map((stage) => [stage.id, stage.order]));
	const knockoutMatches = matches.filter((match) =>
		knockoutStages.some((stage) => stage.id === match.stageId)
	);

	const bracketMatches: BracketMatch[] = knockoutMatches.map((match) => ({
		id: match.id,
		homeTeamId: match.homeTeamId,
		awayTeamId: match.awayTeamId,
		homeSourceMatchId: match.homeSourceMatchId,
		awaySourceMatchId: match.awaySourceMatchId,
		winnerAdvancesToMatchId: match.winnerAdvancesToMatchId,
		winnerAdvancesAs: match.winnerAdvancesAs,
		stageOrder: stageOrderMap.get(match.stageId) ?? 0
	}));

	const resolved = resolveBracketTeams(bracketMatches, predictions);
	const bracket = knockoutMatches
		.filter((match) => predictions[match.id])
		.map((match) => {
			const stage = stages.find((entry) => entry.id === match.stageId)!;
			const resolvedTeams = resolved[match.id];
			const prediction = predictions[match.id]!;

			return {
				id: match.id,
				stageName: stage.name,
				homeTeam: resolvedTeams?.homeTeamId ? teamMap[resolvedTeams.homeTeamId] : null,
				awayTeam: resolvedTeams?.awayTeamId ? teamMap[resolvedTeams.awayTeamId] : null,
				prediction
			};
		});

	return {
		user: profileUser,
		tournament,
		score: scoreRows[0] ?? null,
		matches: matchPredictions,
		groups,
		extras: extrasDisplay,
		podium: podiumDisplay,
		bracket
	};
}
