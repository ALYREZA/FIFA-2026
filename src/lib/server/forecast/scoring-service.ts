import { and, desc, eq, sql } from 'drizzle-orm';
import type { Database } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';
import {
	actualGroupStandings,
	actualTournamentExtras,
	groupStandingPredictions,
	matchPredictions,
	matches,
	stages,
	tournamentExtrasPredictions,
	userScores
} from '$lib/server/db/forecast.schema';
import {
	isCorrectResult,
	isExactScore,
	scoreGroupStandings,
	scoreMatchPrediction,
	scoreTournamentExtras,
	type ScoringRules
} from './rules';
import { getActiveTournament, getTournamentStages, parseScoringRules } from './tournament';

export async function scoreUserPredictions(db: Database, userId: string, tournamentId: string) {
	const tournament = await getActiveTournament(db);
	if (!tournament || tournament.id !== tournamentId) return;

	const rules = parseScoringRules(tournament.scoringRules) as ScoringRules;
	const tournamentStages = await getTournamentStages(db, tournamentId);
	const stageTypeMap = new Map(tournamentStages.map((s) => [s.id, s.type]));

	const userMatchPredictions = await db
		.select({
			prediction: matchPredictions,
			match: matches
		})
		.from(matchPredictions)
		.innerJoin(matches, eq(matchPredictions.matchId, matches.id))
		.where(
			and(eq(matchPredictions.userId, userId), eq(matches.tournamentId, tournamentId))
		);

	let matchPoints = 0;
	let exactScores = 0;
	let correctResults = 0;
	let lastPredictionAt: Date | null = null;

	for (const { prediction, match } of userMatchPredictions) {
		if (match.status !== 'finished' || match.homeScore === null || match.awayScore === null) {
			continue;
		}

		const stageType = stageTypeMap.get(match.stageId) ?? 'group';
		const breakdown = scoreMatchPrediction(
			stageType,
			{ homeScore: prediction.homeScore, awayScore: prediction.awayScore },
			{
				homeScore: match.homeScore,
				awayScore: match.awayScore,
				winnerTeamId: match.winnerTeamId
			},
			match.homeTeamId,
			match.awayTeamId,
			rules
		);

		matchPoints += breakdown.total;
		if (isExactScore(breakdown)) exactScores++;
		if (isCorrectResult(breakdown)) correctResults++;

		await db
			.update(matchPredictions)
			.set({ pointsEarned: breakdown.total, scoreBreakdown: breakdown })
			.where(eq(matchPredictions.id, prediction.id));

		if (!lastPredictionAt || prediction.updatedAt > lastPredictionAt) {
			lastPredictionAt = prediction.updatedAt;
		}
	}

	const standingRows = await db
		.select()
		.from(groupStandingPredictions)
		.where(
			and(
				eq(groupStandingPredictions.userId, userId),
				eq(groupStandingPredictions.tournamentId, tournamentId)
			)
		);

	const actualStandings = await db
		.select()
		.from(actualGroupStandings)
		.where(eq(actualGroupStandings.tournamentId, tournamentId));

	const actualStandingRows = actualStandings.map((r) => ({
		groupId: r.groupId,
		teamId: r.teamId,
		actualPosition: r.actualPosition
	}));

	let standingPoints = 0;
	for (const row of standingRows) {
		const breakdown = scoreGroupStandings(
			[
				{
					groupId: row.groupId,
					teamId: row.teamId,
					predictedPosition: row.predictedPosition
				}
			],
			actualStandingRows,
			rules
		);
		standingPoints += breakdown.total;
		await db
			.update(groupStandingPredictions)
			.set({ pointsEarned: breakdown.total })
			.where(eq(groupStandingPredictions.id, row.id));
	}

	const [extras] = await db
		.select()
		.from(tournamentExtrasPredictions)
		.where(
			and(
				eq(tournamentExtrasPredictions.userId, userId),
				eq(tournamentExtrasPredictions.tournamentId, tournamentId)
			)
		)
		.limit(1);

	const [actualExtras] = await db
		.select()
		.from(actualTournamentExtras)
		.where(eq(actualTournamentExtras.tournamentId, tournamentId))
		.limit(1);

	let extrasPoints = 0;
	if (extras && actualExtras) {
		const extrasBreakdown = scoreTournamentExtras(
			{
				championTeamId: extras.championTeamId,
				runnerUpTeamId: extras.runnerUpTeamId,
				topScorerName: extras.topScorerName,
				darkHorseTeamId: extras.darkHorseTeamId
			},
			{
				championTeamId: actualExtras.championTeamId,
				runnerUpTeamId: actualExtras.runnerUpTeamId,
				topScorerName: actualExtras.topScorerName,
				darkHorseTeamId: actualExtras.darkHorseTeamId
			},
			rules
		);
		extrasPoints = extrasBreakdown.total;

		await db
			.update(tournamentExtrasPredictions)
			.set({ pointsEarned: extrasBreakdown.total })
			.where(eq(tournamentExtrasPredictions.id, extras.id));
	}

	const totalPoints = matchPoints + standingPoints + extrasPoints;
	const now = new Date();

	const [existing] = await db
		.select()
		.from(userScores)
		.where(and(eq(userScores.userId, userId), eq(userScores.tournamentId, tournamentId)))
		.limit(1);

	if (existing) {
		await db
			.update(userScores)
			.set({
				totalPoints,
				matchPoints,
				standingPoints,
				extrasPoints,
				exactScores,
				correctResults,
				lastPredictionAt,
				updatedAt: now
			})
			.where(eq(userScores.id, existing.id));
	} else {
		await db.insert(userScores).values({
			id: crypto.randomUUID(),
			userId,
			tournamentId,
			totalPoints,
			matchPoints,
			standingPoints,
			extrasPoints,
			exactScores,
			correctResults,
			lastPredictionAt,
			updatedAt: now
		});
	}
}

export async function scoreAllUsers(db: Database, tournamentId: string) {
	const usersWithPredictions = await db
		.selectDistinct({ userId: matchPredictions.userId })
		.from(matchPredictions)
		.innerJoin(matches, eq(matchPredictions.matchId, matches.id))
		.where(eq(matches.tournamentId, tournamentId));

	const usersWithStandings = await db
		.selectDistinct({ userId: groupStandingPredictions.userId })
		.from(groupStandingPredictions)
		.where(eq(groupStandingPredictions.tournamentId, tournamentId));

	const usersWithExtras = await db
		.selectDistinct({ userId: tournamentExtrasPredictions.userId })
		.from(tournamentExtrasPredictions)
		.where(eq(tournamentExtrasPredictions.tournamentId, tournamentId));

	const userIds = new Set([
		...usersWithPredictions.map((u) => u.userId),
		...usersWithStandings.map((u) => u.userId),
		...usersWithExtras.map((u) => u.userId)
	]);

	for (const userId of userIds) {
		await scoreUserPredictions(db, userId, tournamentId);
	}

	return userIds.size;
}

export async function getLeaderboard(db: Database, tournamentId: string, limit = 50) {
	return db
		.select({
			userId: userScores.userId,
			username: user.username,
			totalPoints: userScores.totalPoints,
			exactScores: userScores.exactScores,
			correctResults: userScores.correctResults,
			lastPredictionAt: userScores.lastPredictionAt
		})
		.from(userScores)
		.innerJoin(user, eq(userScores.userId, user.id))
		.where(eq(userScores.tournamentId, tournamentId))
		.orderBy(
			desc(userScores.totalPoints),
			desc(userScores.exactScores),
			sql`COALESCE(${userScores.lastPredictionAt}, 0) ASC`
		)
		.limit(limit);
}
