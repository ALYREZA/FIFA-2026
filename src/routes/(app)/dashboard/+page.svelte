<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import CountryFlag from '$lib/components/CountryFlag.svelte';
	import MatchCountdown from '$lib/components/MatchCountdown.svelte';
	import { formatStadiumLabel } from '$lib/format-stadium';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	function profileHref(username: string): Pathname {
		return `/u/${username}` as Pathname;
	}
</script>

{#if !data.tournament}
	<p class="text-muted">{m.dashboard_no_tournament()}</p>
{:else}
	<div class="space-y-6">
		<section>
			<h1 class="text-2xl font-bold text-foreground sm:text-3xl">{data.tournament.name}</h1>
			<p class="mt-2 text-muted">{m.dashboard_intro()}</p>
		</section>

		<div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
			<div class="card p-4 sm:p-5">
				<p class="text-xs text-muted sm:text-sm">{m.dashboard_your_points()}</p>
				<p class="mt-1 text-2xl font-bold text-accent-text sm:text-3xl">
					{data.myScore?.totalPoints ?? 0}
				</p>
			</div>
			<div class="card p-4 sm:p-5">
				<p class="text-xs text-muted sm:text-sm">{m.dashboard_predictions_made()}</p>
				<p class="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
					{data.predictionCount} / {data.totalMatches}
				</p>
			</div>
			<div class="card p-4 sm:p-5">
				<p class="text-xs text-muted sm:text-sm">{m.dashboard_exact_scores()}</p>
				<p class="mt-1 text-2xl font-bold text-highlight sm:text-3xl">
					{data.myScore?.exactScores ?? 0}
				</p>
			</div>
			<div class="card p-4 sm:p-5">
				<p class="text-xs text-muted sm:text-sm">{m.dashboard_correct_results()}</p>
				<p class="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
					{data.myScore?.correctResults ?? 0}
				</p>
			</div>
		</div>

		<section class="grid gap-4 lg:grid-cols-2 lg:gap-6">
			<div class="card p-5 sm:p-6">
				<h2 class="mb-4 text-lg font-semibold text-foreground">{m.dashboard_upcoming()}</h2>
				{#if data.upcoming.length === 0}
					<p class="text-sm text-subtle">{m.dashboard_no_upcoming()}</p>
				{:else}
					<ul class="space-y-3">
						{#each data.upcoming as match (match.id)}
							<li class="list-row flex flex-wrap items-center justify-between gap-2 px-4 py-3">
								<div class="min-w-0">
									<span class="flex items-center gap-1.5 text-sm">
										<CountryFlag teamId={match.homeTeam?.id} />
										{match.homeTeam?.code ?? 'TBD'}
										<span class="text-subtle">{m.vs()}</span>
										<CountryFlag teamId={match.awayTeam?.id} />
										{match.awayTeam?.code ?? 'TBD'}
									</span>
									{#if match.stadium}
										<p class="mt-0.5 truncate text-xs text-muted">
											{formatStadiumLabel(match.stadium, getLocale())}
										</p>
									{/if}
								</div>
								<MatchCountdown kickoffAt={match.kickoffAt} class="shrink-0 text-xs text-subtle" />
							</li>
						{/each}
					</ul>
				{/if}
				<a href={resolve('/predict')} class="link mt-4 inline-block text-sm">
					{m.dashboard_make_predictions()}
				</a>
			</div>

			<div class="card p-5 sm:p-6">
				<h2 class="mb-4 text-lg font-semibold text-foreground">{m.dashboard_leaderboard_top()}</h2>
				{#if data.leaderboard.length === 0}
					<p class="text-sm text-subtle">{m.dashboard_no_scores()}</p>
				{:else}
					<ol class="space-y-2">
						{#each data.leaderboard as entry, i (entry.userId)}
							<li class="list-row flex items-center justify-between px-4 py-2">
								<span class="text-sm">
									<span class="me-2 text-subtle">#{i + 1}</span>
									{#if entry.username}
										<a href={resolve(profileHref(entry.username))} class="link">
											@{entry.username}
										</a>
									{:else}
										{m.leaderboard_anonymous()}
									{/if}
								</span>
								<span class="font-medium text-accent-text">{entry.totalPoints}</span>
							</li>
						{/each}
					</ol>
				{/if}
			</div>
		</section>

		<section class="card border-header-border bg-accent-subtle p-5 sm:p-6">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<h2 class="section-title">{m.dashboard_scoring_rules()}</h2>
				<a href={resolve('/rules')} class="link text-sm">{m.dashboard_view_rules()}</a>
			</div>
			<p class="mt-2 text-sm text-muted">{m.dashboard_rules_teaser()}</p>
		</section>
	</div>
{/if}
