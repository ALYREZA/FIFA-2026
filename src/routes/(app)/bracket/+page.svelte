<script lang="ts">
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-white">{m.bracket_title()}</h1>
		<p class="mt-1 text-sm text-slate-400">{m.bracket_intro()}</p>
	</div>

	{#if data.bracket.length === 0}
		<p class="text-slate-500">{m.bracket_no_matches()}</p>
	{:else}
		<div class="space-y-4">
			{#each data.bracket as match (match.id)}
				<div class="rounded-xl border border-slate-800 bg-slate-900 p-5">
					<p class="mb-3 text-xs font-medium uppercase tracking-wide text-emerald-500">
						{match.stageName}
					</p>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<span class="text-xl">{match.homeTeam?.flagEmoji ?? '❓'}</span>
							<span class="font-medium">{match.homeTeam?.code ?? 'TBD'}</span>
							{#if match.prediction}
								<span class="ms-2 text-emerald-400">
									{match.prediction.homeScore} – {match.prediction.awayScore}
								</span>
							{/if}
						</div>
						<span class="text-slate-600">{m.vs()}</span>
						<div class="flex items-center gap-2">
							{#if match.prediction}
								<span class="me-2 text-emerald-400">
									{match.prediction.awayScore} – {match.prediction.homeScore}
								</span>
							{/if}
							<span class="font-medium">{match.awayTeam?.code ?? 'TBD'}</span>
							<span class="text-xl">{match.awayTeam?.flagEmoji ?? '❓'}</span>
						</div>
					</div>
					{#if !match.prediction}
						<a
							href={resolve('/predict')}
							class="mt-3 inline-block text-xs text-emerald-400 hover:text-emerald-300"
						>
							{m.bracket_add_prediction()}
						</a>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
