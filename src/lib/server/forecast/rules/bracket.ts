import type { BracketPredictionMap, MatchPredictionInput, ValidationError } from './types';
import { deriveWinnerFromPrediction } from './knockout';

export type BracketMatch = {
	id: string;
	homeTeamId: string | null;
	awayTeamId: string | null;
	homeSourceMatchId: string | null;
	awaySourceMatchId: string | null;
	winnerAdvancesToMatchId: string | null;
	winnerAdvancesAs: 'home' | 'away' | null;
	stageOrder: number;
};

export function buildBracketPredictionMap(
	matches: BracketMatch[],
	predictions: Record<string, MatchPredictionInput>
): BracketPredictionMap {
	const winners: BracketPredictionMap = {};

	for (const match of matches) {
		const prediction = predictions[match.id];
		if (!prediction) continue;

		winners[match.id] = deriveWinnerFromPrediction(
			prediction,
			match.homeTeamId,
			match.awayTeamId
		);
	}

	return winners;
}

export function resolveBracketTeams(
	matches: BracketMatch[],
	predictions: Record<string, MatchPredictionInput>
): Record<string, { homeTeamId: string | null; awayTeamId: string | null }> {
	const winners = buildBracketPredictionMap(matches, predictions);
	const resolved: Record<string, { homeTeamId: string | null; awayTeamId: string | null }> = {};

	const sorted = [...matches].sort((a, b) => a.stageOrder - b.stageOrder);

	for (const match of sorted) {
		let home = match.homeTeamId;
		let away = match.awayTeamId;

		if (match.homeSourceMatchId) {
			home = winners[match.homeSourceMatchId] ?? home;
		}

		if (match.awaySourceMatchId) {
			away = winners[match.awaySourceMatchId] ?? away;
		}

		resolved[match.id] = { homeTeamId: home, awayTeamId: away };
	}

	return resolved;
}

export function validateBracketConsistency(
	matches: BracketMatch[],
	predictions: Record<string, MatchPredictionInput>,
	newMatchId: string,
	newPrediction: MatchPredictionInput
): ValidationError | null {
	const allPredictions = { ...predictions, [newMatchId]: newPrediction };
	const winners = buildBracketPredictionMap(matches, allPredictions);
	const resolved = resolveBracketTeams(matches, allPredictions);

	const newMatch = matches.find((m) => m.id === newMatchId);
	if (!newMatch) return null;

	const { homeTeamId, awayTeamId } = resolved[newMatchId] ?? {
		homeTeamId: newMatch.homeTeamId,
		awayTeamId: newMatch.awayTeamId
	};

	const predictedWinner = deriveWinnerFromPrediction(newPrediction, homeTeamId, awayTeamId);

	if (!predictedWinner) {
		return {
			code: 'knockout_draw_not_allowed',
			message: 'Knockout matches cannot end in a draw — pick a winner'
		};
	}

	if (homeTeamId && awayTeamId && predictedWinner !== homeTeamId && predictedWinner !== awayTeamId) {
		return {
			code: 'invalid_winner',
			message: 'Predicted winner must be one of the teams in this match'
		};
	}

	for (const match of matches) {
		if (!match.winnerAdvancesToMatchId || !match.winnerAdvancesAs) continue;

		const winner = winners[match.id];
		if (!winner) continue;

		const downstream = resolved[match.winnerAdvancesToMatchId];
		if (!downstream) continue;

		const slotTeam =
			match.winnerAdvancesAs === 'home' ? downstream.homeTeamId : downstream.awayTeamId;

		if (slotTeam && winner !== slotTeam) {
			const downstreamPrediction = allPredictions[match.winnerAdvancesToMatchId];
			if (downstreamPrediction) {
				return {
					code: 'bracket_inconsistent',
					message:
						'Your bracket picks are inconsistent — a team you eliminated cannot appear in a later round'
				};
			}
		}
	}

	return null;
}
