<script lang="ts">
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();
</script>

<div class="space-y-6">
	<div>
		<h1 class="page-title">{m.bracket_title()}</h1>
		<p class="page-desc">{m.bracket_intro()}</p>
	</div>

	{#if data.bracket.length === 0}
		<p class="text-subtle">{m.bracket_no_matches()}</p>
	{:else}
		<div class="space-y-4">
			{#each data.bracket as match (match.id)}
				<div class="card p-4 sm:p-5">
					<p class="mb-3 text-xs font-medium uppercase tracking-wide text-accent-text">
						{match.stageName}
					</p>
					<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
						<div class="flex items-center gap-2">
							<span class="text-xl">{match.homeTeam?.flagEmoji ?? '❓'}</span>
							<span class="font-medium">{match.homeTeam?.code ?? 'TBD'}</span>
							{#if match.prediction}
								<span class="ms-2 text-accent-text">
									{match.prediction.homeScore} – {match.prediction.awayScore}
								</span>
							{/if}
						</div>
						<span class="text-subtle">{m.vs()}</span>
						<div class="flex items-center gap-2">
							{#if match.prediction}
								<span class="me-2 text-accent-text">
									{match.prediction.awayScore} – {match.prediction.homeScore}
								</span>
							{/if}
							<span class="font-medium">{match.awayTeam?.code ?? 'TBD'}</span>
							<span class="text-xl">{match.awayTeam?.flagEmoji ?? '❓'}</span>
						</div>
					</div>
					{#if !match.prediction}
						<a href={resolve('/predict')} class="link mt-3 inline-block text-xs">
							{m.bracket_add_prediction()}
						</a>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
