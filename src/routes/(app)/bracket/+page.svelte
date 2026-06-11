<script lang="ts">
	import { resolve } from '$app/paths';
	import CountryFlag from '$lib/components/CountryFlag.svelte';
	import { formatKickoffAt } from '$lib/format-datetime';
	import { formatStadiumLabel } from '$lib/format-stadium';
	import { getLocale } from '$lib/paraglide/runtime';
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
					<div class="mb-3 flex flex-wrap items-baseline justify-between gap-2">
						<p class="text-xs font-medium tracking-wide text-accent-text uppercase">
							{match.stageName}
						</p>
						<div class="text-end text-xs text-subtle">
							<span class="block">{formatKickoffAt(match.kickoffAt)}</span>
							{#if match.stadium}
								<span class="block text-muted">
									{formatStadiumLabel(match.stadium, getLocale())}
								</span>
							{/if}
						</div>
					</div>
					<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
						<div class="flex items-center gap-2">
							<CountryFlag teamId={match.homeTeam?.id} class="text-xl" />
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
							<CountryFlag teamId={match.awayTeam?.id} class="text-xl" />
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
