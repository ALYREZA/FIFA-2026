<script lang="ts">
	import { resolve } from '$app/paths';
	import { DEFAULT_SCORING_RULES } from '$lib/forecast/scoring-rules';

	let { data } = $props();
</script>

{#if !data.tournament}
	<p class="text-slate-400">No tournament configured.</p>
{:else}
	<div class="space-y-8">
		<section>
			<h1 class="text-3xl font-bold text-white">{data.tournament.name}</h1>
			<p class="mt-2 text-slate-400">
				Predict match results, group standings, and tournament extras. Earn points — no betting.
			</p>
		</section>

		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-xl border border-slate-800 bg-slate-900 p-5">
				<p class="text-sm text-slate-400">Your points</p>
				<p class="mt-1 text-3xl font-bold text-emerald-400">
					{data.myScore?.totalPoints ?? 0}
				</p>
			</div>
			<div class="rounded-xl border border-slate-800 bg-slate-900 p-5">
				<p class="text-sm text-slate-400">Predictions made</p>
				<p class="mt-1 text-3xl font-bold text-white">
					{data.predictionCount} / {data.totalMatches}
				</p>
			</div>
			<div class="rounded-xl border border-slate-800 bg-slate-900 p-5">
				<p class="text-sm text-slate-400">Exact scores</p>
				<p class="mt-1 text-3xl font-bold text-amber-400">
					{data.myScore?.exactScores ?? 0}
				</p>
			</div>
			<div class="rounded-xl border border-slate-800 bg-slate-900 p-5">
				<p class="text-sm text-slate-400">Correct results</p>
				<p class="mt-1 text-3xl font-bold text-white">
					{data.myScore?.correctResults ?? 0}
				</p>
			</div>
		</div>

		<section class="grid gap-6 lg:grid-cols-2">
			<div class="rounded-xl border border-slate-800 bg-slate-900 p-6">
				<h2 class="mb-4 text-lg font-semibold text-white">Upcoming matches</h2>
				{#if data.upcoming.length === 0}
					<p class="text-sm text-slate-500">No upcoming matches</p>
				{:else}
					<ul class="space-y-3">
						{#each data.upcoming as match (match.id)}
							<li class="flex items-center justify-between rounded-lg bg-slate-800/50 px-4 py-3">
								<span class="text-sm">
									{match.homeTeam?.flagEmoji}
									{match.homeTeam?.code ?? 'TBD'}
									<span class="text-slate-500">vs</span>
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
					Make predictions →
				</a>
			</div>

			<div class="rounded-xl border border-slate-800 bg-slate-900 p-6">
				<h2 class="mb-4 text-lg font-semibold text-white">Leaderboard top 5</h2>
				{#if data.leaderboard.length === 0}
					<p class="text-sm text-slate-500">No scores yet — be the first!</p>
				{:else}
					<ol class="space-y-2">
						{#each data.leaderboard as entry, i (entry.userId)}
							<li class="flex items-center justify-between rounded-lg bg-slate-800/50 px-4 py-2">
								<span class="text-sm">
									<span class="mr-2 text-slate-500">#{i + 1}</span>
									{entry.name}
								</span>
								<span class="font-medium text-emerald-400">{entry.totalPoints} pts</span>
							</li>
						{/each}
					</ol>
				{/if}
			</div>
		</section>

		<section class="rounded-xl border border-emerald-900/30 bg-emerald-950/20 p-6">
			<h2 class="mb-3 text-lg font-semibold text-emerald-300">Scoring rules</h2>
			<div class="grid gap-4 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
				<div>
					<p class="font-medium text-white">Group matches</p>
					<p>Exact: {DEFAULT_SCORING_RULES.group.exactScore}pts</p>
					<p>Result: {DEFAULT_SCORING_RULES.group.correctResult}pts</p>
					<p>Goal diff: +{DEFAULT_SCORING_RULES.group.correctGoalDiff}pt</p>
				</div>
				<div>
					<p class="font-medium text-white">Knockout</p>
					<p>Winner: {DEFAULT_SCORING_RULES.knockout.correctWinner}pts</p>
					<p>Exact score: +{DEFAULT_SCORING_RULES.knockout.exactScoreBonus}pts</p>
				</div>
				<div>
					<p class="font-medium text-white">Group standings</p>
					<p>Exact position: {DEFAULT_SCORING_RULES.standings.positionExact}pts</p>
					<p>Off by 1: {DEFAULT_SCORING_RULES.standings.positionOffByOne}pts</p>
				</div>
				<div>
					<p class="font-medium text-white">Tournament extras</p>
					<p>Champion: {DEFAULT_SCORING_RULES.extras.champion}pts</p>
					<p>Top scorer: {DEFAULT_SCORING_RULES.extras.topScorer}pts</p>
				</div>
			</div>
		</section>
	</div>
{/if}
