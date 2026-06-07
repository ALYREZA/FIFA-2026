<script lang="ts">
	import { resolve } from '$app/paths';
	import CountryFlag from '$lib/components/CountryFlag.svelte';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	const isOwnProfile = $derived(data.viewerUsername === data.user.username);
</script>

<div class="space-y-6">
	<section class="card p-5 sm:p-6">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<h1 class="page-title">@{data.user.username}</h1>
				<p class="page-desc">{m.profile_intro()}</p>
			</div>
			{#if isOwnProfile}
				<a href={resolve('/predict')} class="btn-primary px-4 py-2 text-sm">
					{m.profile_edit_predictions()}
				</a>
			{/if}
		</div>

		{#if data.score}
			<div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
				<div class="rounded-lg bg-card-muted p-4">
					<p class="text-sm text-muted">{m.leaderboard_points()}</p>
					<p class="mt-1 text-2xl font-bold text-accent-text">{data.score.totalPoints}</p>
				</div>
				<div class="rounded-lg bg-card-muted p-4">
					<p class="text-sm text-muted">{m.leaderboard_exact()}</p>
					<p class="mt-1 text-2xl font-bold text-highlight">{data.score.exactScores}</p>
				</div>
				<div class="rounded-lg bg-card-muted p-4">
					<p class="text-sm text-muted">{m.leaderboard_correct()}</p>
					<p class="mt-1 text-2xl font-bold text-foreground">{data.score.correctResults}</p>
				</div>
				<div class="rounded-lg bg-card-muted p-4">
					<p class="text-sm text-muted">{m.profile_match_predictions()}</p>
					<p class="mt-1 text-2xl font-bold text-foreground">{data.matches.length}</p>
				</div>
			</div>
		{:else}
			<p class="mt-4 text-sm text-subtle">{m.profile_no_score()}</p>
		{/if}
	</section>

	<section class="card p-5 sm:p-6">
		<h2 class="section-title mb-4">{m.profile_match_predictions()}</h2>
		{#if data.matches.length === 0}
			<p class="text-sm text-subtle">{m.profile_no_predictions()}</p>
		{:else}
			<div class="space-y-3">
				{#each data.matches as match (match.id)}
					<div class="list-row flex flex-wrap items-center justify-between gap-3 px-4 py-3">
						<div>
							<p class="text-xs text-subtle">{match.stageName}</p>
							<p class="mt-1 flex items-center gap-1.5 text-sm font-medium">
								<CountryFlag teamId={match.homeTeam?.id} />
								{match.homeTeam?.code ?? 'TBD'}
								<span class="text-subtle">{m.vs()}</span>
								<CountryFlag teamId={match.awayTeam?.id} />
								{match.awayTeam?.code ?? 'TBD'}
							</p>
						</div>
						<div class="text-end">
							<p class="text-lg font-semibold text-accent-text" dir="ltr">
								{match.prediction.homeScore} – {match.prediction.awayScore}
							</p>
							<p class="text-xs text-subtle">{match.kickoffAt.toLocaleDateString()}</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	{#if data.groups.length > 0}
		<section class="card p-5 sm:p-6">
			<h2 class="section-title mb-4">{m.profile_group_standings()}</h2>
			<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{#each data.groups as group (group.id)}
					<div class="rounded-lg border border-border p-4">
						<h3 class="mb-3 font-medium text-foreground">
							{m.standings_group({ group: group.id })}
						</h3>
						<ul class="space-y-2">
							{#each group.teams as team (team.id)}
								<li class="flex items-center justify-between text-sm">
									<span class="flex items-center gap-1.5">
										<CountryFlag teamId={team.id} />
										{team.code}
									</span>
									<span class="text-muted">
										{team.predictedPosition ?? '—'}
									</span>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	{#if data.podium}
		<section class="card p-5 sm:p-6">
			<h2 class="section-title mb-4">{m.profile_podium()}</h2>
			<dl class="grid gap-3 text-sm sm:grid-cols-3">
				<div>
					<dt class="text-muted">{m.podium_first()}</dt>
					<dd class="font-medium text-foreground">{data.podium.first?.code ?? '—'}</dd>
				</div>
				<div>
					<dt class="text-muted">{m.podium_second()}</dt>
					<dd class="font-medium text-foreground">{data.podium.second?.code ?? '—'}</dd>
				</div>
				<div>
					<dt class="text-muted">{m.podium_third()}</dt>
					<dd class="font-medium text-foreground">{data.podium.third?.code ?? '—'}</dd>
				</div>
			</dl>
		</section>
	{/if}

	{#if data.extras}
		<section class="card p-5 sm:p-6">
			<h2 class="section-title mb-4">{m.profile_extras()}</h2>
			<dl class="grid gap-3 text-sm sm:grid-cols-2">
				<div>
					<dt class="text-muted">{m.extras_champion()}</dt>
					<dd class="font-medium text-foreground">
						{data.extras.champion?.code ?? '—'}
					</dd>
				</div>
				<div>
					<dt class="text-muted">{m.extras_runner_up()}</dt>
					<dd class="font-medium text-foreground">
						{data.extras.runnerUp?.code ?? '—'}
					</dd>
				</div>
				<div>
					<dt class="text-muted">{m.extras_top_scorer()}</dt>
					<dd class="font-medium text-foreground">
						{data.extras.topScorerName || '—'}
					</dd>
				</div>
				<div>
					<dt class="text-muted">{m.extras_dark_horse()}</dt>
					<dd class="font-medium text-foreground">
						{data.extras.darkHorse?.code ?? '—'}
					</dd>
				</div>
			</dl>
		</section>
	{/if}

	{#if data.bracket.length > 0}
		<section class="card p-5 sm:p-6">
			<h2 class="section-title mb-4">{m.profile_bracket()}</h2>
			<div class="space-y-3">
				{#each data.bracket as match (match.id)}
					<div class="list-row flex flex-wrap items-center justify-between gap-3 px-4 py-3">
						<div>
							<p class="text-xs text-subtle">{match.stageName}</p>
							<p class="mt-1 text-sm">
								{match.homeTeam?.code ?? 'TBD'}
								<span class="text-subtle">{m.vs()}</span>
								{match.awayTeam?.code ?? 'TBD'}
							</p>
						</div>
						<p class="font-semibold text-accent-text" dir="ltr">
							{match.prediction.homeScore} – {match.prediction.awayScore}
						</p>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>
