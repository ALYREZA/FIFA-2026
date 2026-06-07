<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import MatchPredictionForm from '$lib/components/MatchPredictionForm.svelte';

	let { data } = $props();

	async function handlePredict(matchId: string, homeScore: number, awayScore: number) {
		const form = new FormData();
		form.set('matchId', matchId);
		form.set('homeScore', String(homeScore));
		form.set('awayScore', String(awayScore));

		await fetch('?/predict', { method: 'POST', body: form });
		await invalidateAll();
	}
</script>

{#if !data.tournament}
	<p class="text-slate-400">No tournament configured.</p>
{:else}
	<div class="space-y-8">
		<div>
			<h1 class="text-2xl font-bold text-white">Match predictions</h1>
			<p class="mt-1 text-sm text-slate-400">
				Predictions lock {data.tournament.lockMinutesBeforeKickoff} minutes before kickoff.
			</p>
		</div>

		{#each data.stages as stage (stage.id)}
			{@const stageMatches = data.matches.filter((m) => m.stageId === stage.id)}
			{#if stageMatches.length > 0}
				<section>
					<h2 class="mb-4 text-lg font-semibold text-emerald-400">{stage.name}</h2>

					{#if !stageMatches[0].stageUnlocked}
						<p class="rounded-lg border border-amber-900/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-300">
							This stage unlocks after the previous round is complete.
						</p>
					{:else}
						<div class="grid gap-4 md:grid-cols-2">
							{#each stageMatches as match (match.id)}
								<MatchPredictionForm
									matchId={match.id}
									homeTeam={match.homeTeam}
									awayTeam={match.awayTeam}
									homeScore={match.prediction?.homeScore ?? 0}
									awayScore={match.prediction?.awayScore ?? 0}
									locked={match.locked || !match.stageUnlocked}
									isKnockout={stage.type !== 'group'}
									kickoffAt={match.kickoffAt}
									onSubmit={handlePredict}
								/>
							{/each}
						</div>
					{/if}
				</section>
			{/if}
		{/each}
	</div>
{/if}
