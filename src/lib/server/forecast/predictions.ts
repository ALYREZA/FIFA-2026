import { and, eq } from 'drizzle-orm';
import type { Database } from '$lib/server/db';
import {
	matchPredictions,
	matches,
	groupStandingPredictions,
	podiumPredictions,
	tournamentExtrasPredictions
} from '$lib/server/db/forecast.schema';
import type { BracketMatch } from './rules/bracket';
import { deriveWinnerFromPrediction } from './rules/knockout';
import {
	validateMatchPrediction,
	validateGroupStandings,
	validateTournamentExtras,
	validateExtrasLock,
	validatePodiumPrediction,
	validatePodiumSubmission,
	calculatePodiumCost,
	getPodiumOpensAt,
	getPodiumLocksAt,
	type GroupStandingInput,
	type TournamentExtrasInput,
	type MatchPredictionInput,
	type PodiumPredictionInput
} from './rules';
import { deductCoins, ensureUserCoinBalance } from './coins';
import {
	getActiveTournament,
	getCompletedStageOrders,
	getTournamentMatches,
	getTournamentStages
} from './tournament';

export async function getUserMatchPredictions(db: Database, userId: string, tournamentId: string) {
	return db
		.select()
		.from(matchPredictions)
		.innerJoin(matches, eq(matchPredictions.matchId, matches.id))
		.where(and(eq(matchPredictions.userId, userId), eq(matches.tournamentId, tournamentId)));
}

export async function getUserPredictionsMap(db: Database, userId: string, tournamentId: string) {
	const rows = await db
		.select({
			matchId: matchPredictions.matchId,
			homeScore: matchPredictions.homeScore,
			awayScore: matchPredictions.awayScore
		})
		.from(matchPredictions)
		.innerJoin(matches, eq(matchPredictions.matchId, matches.id))
		.where(and(eq(matchPredictions.userId, userId), eq(matches.tournamentId, tournamentId)));

	const map: Record<string, MatchPredictionInput> = {};
	for (const row of rows) {
		map[row.matchId] = { homeScore: row.homeScore, awayScore: row.awayScore };
	}
	return map;
}

function toBracketMatches(
	tournamentMatches: Awaited<ReturnType<typeof getTournamentMatches>>,
	stageOrderMap: Map<string, number>
): BracketMatch[] {
	return tournamentMatches.map((m) => ({
		id: m.id,
		homeTeamId: m.homeTeamId,
		awayTeamId: m.awayTeamId,
		homeSourceMatchId: m.homeSourceMatchId,
		awaySourceMatchId: m.awaySourceMatchId,
		winnerAdvancesToMatchId: m.winnerAdvancesToMatchId,
		winnerAdvancesAs: m.winnerAdvancesAs,
		stageOrder: stageOrderMap.get(m.stageId) ?? 0
	}));
}

export async function submitMatchPrediction(
	db: Database,
	userId: string,
	matchId: string,
	prediction: MatchPredictionInput
) {
	const tournament = await getActiveTournament(db);
	if (!tournament) return { error: { code: 'no_tournament', message: 'No active tournament' } };

	const [match] = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
	if (!match) return { error: { code: 'not_found', message: 'Match not found' } };

	const tournamentStages = await getTournamentStages(db, tournament.id);
	const stage = tournamentStages.find((s) => s.id === match.stageId);
	if (!stage) return { error: { code: 'not_found', message: 'Stage not found' } };

	const completedStageOrders = await getCompletedStageOrders(db, tournament.id);
	const existingPredictions = await getUserPredictionsMap(db, userId, tournament.id);
	const tournamentMatches = await getTournamentMatches(db, tournament.id);
	const stageOrderMap = new Map(tournamentStages.map((s) => [s.id, s.order]));
	const bracketMatches = toBracketMatches(tournamentMatches, stageOrderMap);

	const validationError = validateMatchPrediction(
		{
			id: match.id,
			stageType: stage.type,
			kickoffAt: match.kickoffAt,
			status: match.status,
			homeTeamId: match.homeTeamId,
			awayTeamId: match.awayTeamId,
			lockMinutesBeforeKickoff: tournament.lockMinutesBeforeKickoff
		},
		{
			type: stage.type,
			order: stage.order,
			unlockAfterOrder: stage.unlockAfterOrder,
			deadlineAt: stage.deadlineAt
		},
		completedStageOrders,
		new Date(),
		prediction,
		bracketMatches,
		existingPredictions
	);

	if (validationError) return { error: validationError };

	const winnerTeamId = deriveWinnerFromPrediction(prediction, match.homeTeamId, match.awayTeamId);
	const now = new Date();
	const existing = await db
		.select()
		.from(matchPredictions)
		.where(and(eq(matchPredictions.userId, userId), eq(matchPredictions.matchId, matchId)))
		.limit(1);

	if (existing[0]) {
		await db
			.update(matchPredictions)
			.set({
				homeScore: prediction.homeScore,
				awayScore: prediction.awayScore,
				winnerTeamId,
				updatedAt: now
			})
			.where(eq(matchPredictions.id, existing[0].id));
	} else {
		await db.insert(matchPredictions).values({
			id: crypto.randomUUID(),
			userId,
			matchId,
			homeScore: prediction.homeScore,
			awayScore: prediction.awayScore,
			winnerTeamId,
			createdAt: now,
			updatedAt: now
		});
	}

	return { success: true };
}

export async function submitGroupStandings(
	db: Database,
	userId: string,
	predictions: GroupStandingInput[]
) {
	const tournament = await getActiveTournament(db);
	if (!tournament) return { error: { code: 'no_tournament', message: 'No active tournament' } };

	const validationError = validateGroupStandings(predictions);
	if (validationError) return { error: validationError };

	if (tournament.extrasLockedAt && new Date() >= tournament.extrasLockedAt) {
		return { error: { code: 'standings_locked', message: 'Group standings are locked' } };
	}

	for (const prediction of predictions) {
		const existing = await db
			.select()
			.from(groupStandingPredictions)
			.where(
				and(
					eq(groupStandingPredictions.userId, userId),
					eq(groupStandingPredictions.groupId, prediction.groupId),
					eq(groupStandingPredictions.teamId, prediction.teamId)
				)
			)
			.limit(1);

		const now = new Date();

		if (existing[0]) {
			await db
				.update(groupStandingPredictions)
				.set({ predictedPosition: prediction.predictedPosition, updatedAt: now })
				.where(eq(groupStandingPredictions.id, existing[0].id));
		} else {
			await db.insert(groupStandingPredictions).values({
				id: crypto.randomUUID(),
				userId,
				tournamentId: tournament.id,
				groupId: prediction.groupId,
				teamId: prediction.teamId,
				predictedPosition: prediction.predictedPosition,
				createdAt: now,
				updatedAt: now
			});
		}
	}

	return { success: true };
}

export async function submitTournamentExtras(
	db: Database,
	userId: string,
	input: TournamentExtrasInput
) {
	const tournament = await getActiveTournament(db);
	if (!tournament) return { error: { code: 'no_tournament', message: 'No active tournament' } };

	const lockError = validateExtrasLock(tournament.extrasLockedAt, new Date());
	if (lockError) return { error: lockError };

	const validationError = validateTournamentExtras(input);
	if (validationError) return { error: validationError };

	const now = new Date();
	const existing = await db
		.select()
		.from(tournamentExtrasPredictions)
		.where(
			and(
				eq(tournamentExtrasPredictions.userId, userId),
				eq(tournamentExtrasPredictions.tournamentId, tournament.id)
			)
		)
		.limit(1);

	if (existing[0]) {
		await db
			.update(tournamentExtrasPredictions)
			.set({
				championTeamId: input.championTeamId,
				runnerUpTeamId: input.runnerUpTeamId,
				topScorerName: input.topScorerName,
				darkHorseTeamId: input.darkHorseTeamId,
				updatedAt: now
			})
			.where(eq(tournamentExtrasPredictions.id, existing[0].id));
	} else {
		await db.insert(tournamentExtrasPredictions).values({
			id: crypto.randomUUID(),
			userId,
			tournamentId: tournament.id,
			championTeamId: input.championTeamId,
			runnerUpTeamId: input.runnerUpTeamId,
			topScorerName: input.topScorerName,
			darkHorseTeamId: input.darkHorseTeamId,
			createdAt: now,
			updatedAt: now
		});
	}

	return { success: true };
}

export async function getUserExtras(db: Database, userId: string, tournamentId: string) {
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
	return extras ?? null;
}

export async function getUserPodium(db: Database, userId: string, tournamentId: string) {
	const [podium] = await db
		.select()
		.from(podiumPredictions)
		.where(
			and(eq(podiumPredictions.userId, userId), eq(podiumPredictions.tournamentId, tournamentId))
		)
		.limit(1);
	return podium ?? null;
}

export async function submitPodiumPrediction(
	db: Database,
	userId: string,
	input: PodiumPredictionInput
) {
	const tournament = await getActiveTournament(db);
	if (!tournament) return { error: { code: 'no_tournament', message: 'No active tournament' } };

	const now = new Date();
	const opensAt = getPodiumOpensAt(tournament.startsAt);
	const locksAt = getPodiumLocksAt(tournament.extrasLockedAt, tournament.startsAt);

	const existing = await getUserPodium(db, userId, tournament.id);
	const submissionError = validatePodiumSubmission(now, opensAt, locksAt, !!existing);
	if (submissionError) return { error: submissionError };

	const validationError = validatePodiumPrediction(input);
	if (validationError) return { error: validationError };

	const cost = calculatePodiumCost(now, opensAt, locksAt);
	const coinResult = await deductCoins(db, userId, tournament.id, cost);
	if ('error' in coinResult) return { error: coinResult.error };

	await db.insert(podiumPredictions).values({
		id: crypto.randomUUID(),
		userId,
		tournamentId: tournament.id,
		firstPlaceTeamId: input.firstPlaceTeamId,
		secondPlaceTeamId: input.secondPlaceTeamId,
		thirdPlaceTeamId: input.thirdPlaceTeamId,
		coinsSpent: cost,
		lockedAt: now,
		createdAt: now
	});

	return { success: true, coinsSpent: cost, coinBalance: coinResult.newBalance };
}

export async function getPodiumPricing(db: Database, userId: string, tournamentId: string) {
	const tournament = await getActiveTournament(db);
	if (!tournament) return null;

	const now = new Date();
	const opensAt = getPodiumOpensAt(tournament.startsAt);
	const locksAt = getPodiumLocksAt(tournament.extrasLockedAt, tournament.startsAt);
	const [podium, coinBalance] = await Promise.all([
		getUserPodium(db, userId, tournamentId),
		ensureUserCoinBalance(db, userId, tournamentId)
	]);

	return {
		currentCost: calculatePodiumCost(now, opensAt, locksAt),
		opensAt,
		locksAt,
		submitted: !!podium,
		coinBalance
	};
}

export async function getUserGroupStandings(db: Database, userId: string, tournamentId: string) {
	return db
		.select()
		.from(groupStandingPredictions)
		.where(
			and(
				eq(groupStandingPredictions.userId, userId),
				eq(groupStandingPredictions.tournamentId, tournamentId)
			)
		);
}
