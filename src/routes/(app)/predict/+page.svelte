<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import MatchPredictionForm from '$lib/components/MatchPredictionForm.svelte';
	import * as m from '$lib/paraglide/messages';

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
	<p class="text-muted">{m.dashboard_no_tournament()}</p>
{:else}
	<div class="space-y-6">
		<div>
			<h1 class="page-title">{m.predict_title()}</h1>
			<p class="page-desc">
				{m.predict_lock_hint({ minutes: String(data.tournament.lockMinutesBeforeKickoff) })}
			</p>
		</div>

		{#each data.stages as stage (stage.id)}
			{@const stageMatches = data.matches.filter((match) => match.stageId === stage.id)}
			{#if stageMatches.length > 0}
				<section>
					<h2 class="section-title mb-4">{stage.name}</h2>

					{#if !stageMatches[0].stageUnlocked}
						<p class="alert-warning px-4 py-3">{m.predict_stage_locked()}</p>
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
