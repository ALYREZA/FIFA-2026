import { eq } from 'drizzle-orm';
import type { Database } from '$lib/server/db';
import { matches, stages, teams, tournaments } from '$lib/server/db/forecast.schema';
import { DEFAULT_SCORING_RULES, type ScoringRules } from './rules';

export async function getActiveTournament(db: Database) {
	const [tournament] = await db.select().from(tournaments).limit(1);
	return tournament ?? null;
}

export function parseScoringRules(json: unknown): ScoringRules {
	if (!json || typeof json !== 'object') return DEFAULT_SCORING_RULES;

	const parsed = json as Partial<ScoringRules>;
	return {
		...DEFAULT_SCORING_RULES,
		...parsed,
		group: { ...DEFAULT_SCORING_RULES.group, ...parsed.group },
		knockout: { ...DEFAULT_SCORING_RULES.knockout, ...parsed.knockout },
		standings: { ...DEFAULT_SCORING_RULES.standings, ...parsed.standings },
		extras: { ...DEFAULT_SCORING_RULES.extras, ...parsed.extras },
		podium: { ...DEFAULT_SCORING_RULES.podium, ...parsed.podium },
		earlyPrediction: parsed.earlyPrediction ?? DEFAULT_SCORING_RULES.earlyPrediction
	};
}

export async function getTournamentTeams(db: Database, tournamentId: string) {
	return db.select().from(teams).where(eq(teams.tournamentId, tournamentId));
}

export async function getTournamentStages(db: Database, tournamentId: string) {
	return db
		.select()
		.from(stages)
		.where(eq(stages.tournamentId, tournamentId))
		.orderBy(stages.order);
}

export async function getTournamentMatches(db: Database, tournamentId: string) {
	return db.select().from(matches).where(eq(matches.tournamentId, tournamentId));
}

export async function getCompletedStageOrders(db: Database, tournamentId: string) {
	const tournamentStages = await getTournamentStages(db, tournamentId);
	const tournamentMatches = await getTournamentMatches(db, tournamentId);

	const completed = new Set<number>();

	for (const stage of tournamentStages) {
		const stageMatches = tournamentMatches.filter((m) => m.stageId === stage.id);
		if (stageMatches.length > 0 && stageMatches.every((m) => m.status === 'finished')) {
			completed.add(stage.order);
		}
	}

	return [...completed];
}
