<script lang="ts">
	import { resolve } from '$app/paths';
	import { DEFAULT_SCORING_RULES } from '$lib/forecast/scoring-rules';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();
</script>

{#if !data.tournament}
	<p class="text-slate-400">{m.dashboard_no_tournament()}</p>
{:else}
	<div class="space-y-8">
		<section>
			<h1 class="text-3xl font-bold text-white">{data.tournament.name}</h1>
			<p class="mt-2 text-slate-400">{m.dashboard_intro()}</p>
		</section>

		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-xl border border-slate-800 bg-slate-900 p-5">
				<p class="text-sm text-slate-400">{m.dashboard_your_points()}</p>
				<p class="mt-1 text-3xl font-bold text-emerald-400">
					{data.myScore?.totalPoints ?? 0}
				</p>
			</div>
			<div class="rounded-xl border border-slate-800 bg-slate-900 p-5">
				<p class="text-sm text-slate-400">{m.dashboard_predictions_made()}</p>
				<p class="mt-1 text-3xl font-bold text-white">
					{data.predictionCount} / {data.totalMatches}
				</p>
			</div>
			<div class="rounded-xl border border-slate-800 bg-slate-900 p-5">
				<p class="text-sm text-slate-400">{m.dashboard_exact_scores()}</p>
				<p class="mt-1 text-3xl font-bold text-amber-400">
					{data.myScore?.exactScores ?? 0}
				</p>
			</div>
			<div class="rounded-xl border border-slate-800 bg-slate-900 p-5">
				<p class="text-sm text-slate-400">{m.dashboard_correct_results()}</p>
				<p class="mt-1 text-3xl font-bold text-white">
					{data.myScore?.correctResults ?? 0}
				</p>
			</div>
		</div>

		<section class="grid gap-6 lg:grid-cols-2">
			<div class="rounded-xl border border-slate-800 bg-slate-900 p-6">
				<h2 class="mb-4 text-lg font-semibold text-white">{m.dashboard_upcoming()}</h2>
				{#if data.upcoming.length === 0}
					<p class="text-sm text-slate-500">{m.dashboard_no_upcoming()}</p>
				{:else}
					<ul class="space-y-3">
						{#each data.upcoming as match (match.id)}
							<li class="flex items-center justify-between rounded-lg bg-slate-800/50 px-4 py-3">
								<span class="text-sm">
									{match.homeTeam?.flagEmoji}
									{match.homeTeam?.code ?? 'TBD'}
									<span class="text-slate-500">{m.vs()}</span>
									{match.awayTeam?.flagEmoji}
									{match.awayTeam?.code ?? 'TBD'}
								</span>
								<span class="text-xs text-slate-500">
									{match.kickoffAt.toLocaleDateString()}
								</span>
							</li>
						{/each}
					</ul>
				{/if}
				<a
					href={resolve('/predict')}
					class="mt-4 inline-block text-sm text-emerald-400 hover:text-emerald-300"
				>
					{m.dashboard_make_predictions()}
				</a>
			</div>

			<div class="rounded-xl border border-slate-800 bg-slate-900 p-6">
				<h2 class="mb-4 text-lg font-semibold text-white">{m.dashboard_leaderboard_top()}</h2>
				{#if data.leaderboard.length === 0}
					<p class="text-sm text-slate-500">{m.dashboard_no_scores()}</p>
				{:else}
					<ol class="space-y-2">
						{#each data.leaderboard as entry, i (entry.userId)}
							<li class="flex items-center justify-between rounded-lg bg-slate-800/50 px-4 py-2">
								<span class="text-sm">
									<span class="me-2 text-slate-500">#{i + 1}</span>
									{entry.name}
								</span>
								<span class="font-medium text-emerald-400">{entry.totalPoints}</span>
							</li>
						{/each}
					</ol>
				{/if}
			</div>
		</section>

		<section class="rounded-xl border border-emerald-900/30 bg-emerald-950/20 p-6">
			<h2 class="mb-3 text-lg font-semibold text-emerald-300">{m.dashboard_scoring_rules()}</h2>
			<div class="grid gap-4 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
				<div>
					<p class="font-medium text-white">{m.dashboard_group_matches()}</p>
					<p>Exact: {DEFAULT_SCORING_RULES.group.exactScore}</p>
					<p>Result: {DEFAULT_SCORING_RULES.group.correctResult}</p>
					<p>Goal diff: +{DEFAULT_SCORING_RULES.group.correctGoalDiff}</p>
				</div>
				<div>
					<p class="font-medium text-white">{m.dashboard_knockout()}</p>
					<p>Winner: {DEFAULT_SCORING_RULES.knockout.correctWinner}</p>
					<p>Exact: +{DEFAULT_SCORING_RULES.knockout.exactScoreBonus}</p>
				</div>
				<div>
					<p class="font-medium text-white">{m.dashboard_group_standings()}</p>
					<p>Exact: {DEFAULT_SCORING_RULES.standings.positionExact}</p>
					<p>Off by 1: {DEFAULT_SCORING_RULES.standings.positionOffByOne}</p>
				</div>
				<div>
					<p class="font-medium text-white">{m.dashboard_tournament_extras()}</p>
					<p>Champion: {DEFAULT_SCORING_RULES.extras.champion}</p>
					<p>Top scorer: {DEFAULT_SCORING_RULES.extras.topScorer}</p>
				</div>
			</div>
		</section>
	</div>
{/if}
