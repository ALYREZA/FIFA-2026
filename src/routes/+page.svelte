<script lang="ts">
	import { resolve } from '$app/paths';
	import GameRules from '$lib/components/GameRules.svelte';
	import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	const lockMinutes = $derived(data.tournament?.lockMinutesBeforeKickoff ?? 15);

	const features = $derived([
		{
			id: 'matches',
			title: m.home_feature_matches_title,
			desc: m.home_feature_matches_desc
		},
		{
			id: 'standings',
			title: m.home_feature_standings_title,
			desc: m.home_feature_standings_desc
		},
		{
			id: 'bracket',
			title: m.home_feature_bracket_title,
			desc: m.home_feature_bracket_desc
		},
		{
			id: 'extras',
			title: m.home_feature_extras_title,
			desc: m.home_feature_extras_desc
		},
		{
			id: 'podium',
			title: m.home_feature_podium_title,
			desc: m.home_feature_podium_desc
		},
		{
			id: 'leaderboard',
			title: m.home_feature_leaderboard_title,
			desc: m.home_feature_leaderboard_desc
		}
	]);
</script>

<div class="min-h-screen bg-background text-foreground">
	<header
		class="safe-area-top safe-area-x sticky top-0 z-10 border-b border-header-border bg-header/95 backdrop-blur"
	>
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
			<div>
				<p class="text-lg font-bold text-accent-text">{m.app_title()}</p>
				<p class="text-xs text-muted">{m.app_tagline()}</p>
			</div>

			<div class="flex items-center gap-2">
				<a href="#rules" class="btn-ghost hidden px-3 py-2 text-sm sm:inline-flex">
					{m.home_read_rules()}
				</a>
				<LocaleSwitcher />
				<a href={resolve('/login')} class="btn-primary px-4 py-2 text-sm">
					{m.home_sign_in()}
				</a>
			</div>
		</div>
	</header>

	<main class="safe-area-x mx-auto max-w-4xl px-4 py-10 sm:py-14">
		<section class="mb-14 text-center sm:mb-16">
			<h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
				{m.app_title()}
			</h1>
			<p class="mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg">
				{m.home_hero_desc()}
			</p>
			<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
				<a href={resolve('/login')} class="btn-primary w-full px-6 py-3 text-sm sm:w-auto">
					{m.home_get_started()}
				</a>
				<a href="#rules" class="btn-ghost w-full px-6 py-3 text-sm sm:w-auto">
					{m.home_read_rules()}
				</a>
			</div>
		</section>

		<section class="mb-14 sm:mb-16">
			<h2 class="section-title mb-6 text-center">{m.home_features_title()}</h2>
			<div class="grid gap-4 sm:grid-cols-2">
				{#each features as feature (feature.id)}
					<div class="card p-5 sm:p-6">
						<h3 class="font-semibold text-foreground">{feature.title()}</h3>
						<p class="mt-2 text-sm text-muted">{feature.desc()}</p>
					</div>
				{/each}
			</div>
		</section>

		<section id="rules" class="scroll-mt-20">
			<div class="mb-8">
				<h2 class="page-title">{m.rules_title()}</h2>
				<p class="page-desc">{m.rules_intro()}</p>
			</div>

			<GameRules {lockMinutes} />
		</section>

		<section class="card mt-14 border-header-border bg-accent-subtle p-6 text-center sm:p-8">
			<h2 class="text-xl font-bold text-foreground">{m.home_cta_title()}</h2>
			<p class="mx-auto mt-3 max-w-lg text-sm text-muted">{m.home_cta_desc()}</p>
			<a href={resolve('/login')} class="btn-primary mt-6 inline-flex px-8 py-3 text-sm">
				{m.home_cta_button()}
			</a>
		</section>
	</main>
</div>
