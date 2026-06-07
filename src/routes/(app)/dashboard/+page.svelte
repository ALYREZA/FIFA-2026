<script lang="ts">
	import { resolve } from '$app/paths';
	import { DEFAULT_SCORING_RULES } from '$lib/forecast/scoring-rules';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();
</script>

{#if !data.tournament}
	<p class="text-muted">{m.dashboard_no_tournament()}</p>
{:else}
	<div class="space-y-6">
		<section>
			<h1 class="text-3xl font-bold text-foreground">{data.tournament.name}</h1>
			<p class="mt-2 text-muted">{m.dashboard_intro()}</p>
		</section>

		<div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
			<div class="card p-4 sm:p-5">
				<p class="text-sm text-muted">{m.dashboard_your_points()}</p>
				<p class="mt-1 text-2xl font-bold text-accent-text sm:text-3xl">
					{data.myScore?.totalPoints ?? 0}
				</p>
			</div>
			<div class="card p-4 sm:p-5">
				<p class="text-sm text-muted">{m.dashboard_predictions_made()}</p>
				<p class="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
					{data.predictionCount} / {data.totalMatches}
				</p>
			</div>
			<div class="card p-4 sm:p-5">
				<p class="text-sm text-muted">{m.dashboard_exact_scores()}</p>
				<p class="mt-1 text-2xl font-bold text-highlight sm:text-3xl">
					{data.myScore?.exactScores ?? 0}
				</p>
			</div>
			<div class="card p-4 sm:p-5">
				<p class="text-sm text-muted">{m.dashboard_correct_results()}</p>
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
							<li class="list-row flex items-center justify-between px-4 py-3">
								<span class="text-sm">
									{match.homeTeam?.flagEmoji}
									{match.homeTeam?.code ?? 'TBD'}
									<span class="text-subtle">{m.vs()}</span>
									{match.awayTeam?.flagEmoji}
									{match.awayTeam?.code ?? 'TBD'}
								</span>
								<span class="text-xs text-subtle">
									{match.kickoffAt.toLocaleDateString()}
								</span>
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
									{entry.name}
								</span>
								<span class="font-medium text-accent-text">{entry.totalPoints}</span>
							</li>
						{/each}
					</ol>
				{/if}
			</div>
		</section>

		<section class="card border-header-border bg-accent-subtle p-5 sm:p-6">
			<h2 class="section-title mb-3">{m.dashboard_scoring_rules()}</h2>
			<div class="grid gap-4 text-sm text-muted sm:grid-cols-2 lg:grid-cols-4">
				<div>
					<p class="font-medium text-foreground">{m.dashboard_group_matches()}</p>
					<p>Exact: {DEFAULT_SCORING_RULES.group.exactScore}</p>
					<p>Result: {DEFAULT_SCORING_RULES.group.correctResult}</p>
					<p>Goal diff: +{DEFAULT_SCORING_RULES.group.correctGoalDiff}</p>
				</div>
				<div>
					<p class="font-medium text-foreground">{m.dashboard_knockout()}</p>
					<p>Winner: {DEFAULT_SCORING_RULES.knockout.correctWinner}</p>
					<p>Exact: +{DEFAULT_SCORING_RULES.knockout.exactScoreBonus}</p>
				</div>
				<div>
					<p class="font-medium text-foreground">{m.dashboard_group_standings()}</p>
					<p>Exact: {DEFAULT_SCORING_RULES.standings.positionExact}</p>
					<p>Off by 1: {DEFAULT_SCORING_RULES.standings.positionOffByOne}</p>
				</div>
				<div>
					<p class="font-medium text-foreground">{m.dashboard_tournament_extras()}</p>
					<p>Champion: {DEFAULT_SCORING_RULES.extras.champion}</p>
					<p>Top scorer: {DEFAULT_SCORING_RULES.extras.topScorer}</p>
				</div>
			</div>
		</section>
	</div>
{/if}
