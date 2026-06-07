<script lang="ts">
	import { COIN_RULES, DEFAULT_SCORING_RULES } from '$lib/forecast/game-rules';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	const lockMinutes = data.tournament?.lockMinutesBeforeKickoff ?? 15;
</script>

<div class="space-y-8">
	<section>
		<h1 class="page-title">{m.rules_title()}</h1>
		<p class="page-desc">{m.rules_intro()}</p>
	</section>

	<section class="card border-header-border bg-accent-subtle p-5 sm:p-6">
		<h2 class="section-title mb-3">{m.rules_not_gambling_title()}</h2>
		<ul class="list-disc space-y-2 ps-5 text-sm text-muted">
			<li>{m.rules_not_gambling_1()}</li>
			<li>{m.rules_not_gambling_2()}</li>
			<li>{m.rules_not_gambling_3()}</li>
		</ul>
	</section>

	<section class="card p-5 sm:p-6">
		<h2 class="section-title mb-3">{m.rules_points_title()}</h2>
		<p class="mb-4 text-sm text-muted">{m.rules_points_intro()}</p>
		<div class="grid gap-4 text-sm text-muted sm:grid-cols-2 lg:grid-cols-4">
			<div>
				<p class="font-medium text-foreground">{m.dashboard_group_matches()}</p>
				<p>{m.rules_points_exact({ points: String(DEFAULT_SCORING_RULES.group.exactScore) })}</p>
				<p>{m.rules_points_result({ points: String(DEFAULT_SCORING_RULES.group.correctResult) })}</p>
				<p>
					{m.rules_points_goal_diff({ points: String(DEFAULT_SCORING_RULES.group.correctGoalDiff) })}
				</p>
			</div>
			<div>
				<p class="font-medium text-foreground">{m.dashboard_knockout()}</p>
				<p>
					{m.rules_points_winner({ points: String(DEFAULT_SCORING_RULES.knockout.correctWinner) })}
				</p>
				<p>
					{m.rules_points_exact_bonus({
						points: String(DEFAULT_SCORING_RULES.knockout.exactScoreBonus)
					})}
				</p>
			</div>
			<div>
				<p class="font-medium text-foreground">{m.dashboard_group_standings()}</p>
				<p>
					{m.rules_points_exact({ points: String(DEFAULT_SCORING_RULES.standings.positionExact) })}
				</p>
				<p>
					{m.rules_points_off_by_one({
						points: String(DEFAULT_SCORING_RULES.standings.positionOffByOne)
					})}
				</p>
			</div>
			<div>
				<p class="font-medium text-foreground">{m.dashboard_tournament_extras()}</p>
				<p>{m.rules_points_champion({ points: String(DEFAULT_SCORING_RULES.extras.champion) })}</p>
				<p>{m.rules_points_runner_up({ points: String(DEFAULT_SCORING_RULES.extras.runnerUp) })}</p>
				<p>{m.rules_points_top_scorer({ points: String(DEFAULT_SCORING_RULES.extras.topScorer) })}</p>
				<p>{m.rules_points_dark_horse({ points: String(DEFAULT_SCORING_RULES.extras.darkHorse) })}</p>
			</div>
		</div>
	</section>

	<section class="card p-5 sm:p-6">
		<h2 class="section-title mb-3">{m.rules_locking_title()}</h2>
		<ul class="list-disc space-y-2 ps-5 text-sm text-muted">
			<li>{m.rules_locking_match({ minutes: String(lockMinutes) })}</li>
			<li>{m.rules_locking_stages()}</li>
			<li>{m.rules_locking_knockout_draw()}</li>
			<li>{m.rules_locking_bracket()}</li>
			<li>{m.rules_locking_extras()}</li>
		</ul>
	</section>

	<section class="card p-5 sm:p-6">
		<h2 class="section-title mb-3">{m.rules_coins_title()}</h2>
		<p class="mb-4 text-sm text-muted">{m.rules_coins_intro()}</p>

		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 font-medium text-foreground">{m.rules_coins_starting()}</h3>
				<p class="text-sm text-muted">
					{m.rules_coins_starting_value({ coins: String(COIN_RULES.startingBalance) })}
				</p>
			</div>

			<div>
				<h3 class="mb-2 font-medium text-foreground">{m.rules_coins_costs_title()}</h3>
				<ul class="space-y-1 text-sm text-muted">
					<li>{m.rules_coins_cost_match({ coins: String(COIN_RULES.costs.matchPredict) })}</li>
					<li>{m.rules_coins_cost_edit({ coins: String(COIN_RULES.costs.matchEdit) })}</li>
					<li>
						{m.rules_coins_cost_standings({ coins: String(COIN_RULES.costs.groupStandings) })}
					</li>
					<li>{m.rules_coins_cost_extras({ coins: String(COIN_RULES.costs.tournamentExtras) })}</li>
				</ul>
			</div>

			<div>
				<h3 class="mb-2 font-medium text-foreground">{m.rules_coins_late_title()}</h3>
				<ul class="space-y-1 text-sm text-muted">
					<li>{m.rules_coins_late_normal()}</li>
					<li>
						{m.rules_coins_late_last_call({
							minutes: String(COIN_RULES.lateWindowMinutes.lastCallStart),
							multiplier: String(COIN_RULES.lateWindowMultipliers.lastCall)
						})}
					</li>
					<li>
						{m.rules_coins_late_final({
							minutes: String(COIN_RULES.lateWindowMinutes.finalWhistleStart),
							multiplier: String(COIN_RULES.lateWindowMultipliers.finalWhistle),
							stop: String(COIN_RULES.lateWindowMinutes.hardStop)
						})}
					</li>
				</ul>
			</div>

			<div>
				<h3 class="mb-2 font-medium text-foreground">{m.rules_coins_earn_title()}</h3>
				<ul class="space-y-1 text-sm text-muted">
					<li>
						{m.rules_coins_earn_result({ coins: String(COIN_RULES.earnBack.correctResult) })}
					</li>
					<li>
						{m.rules_coins_earn_exact({ coins: String(COIN_RULES.earnBack.exactScore) })}
					</li>
					<li>
						{m.rules_coins_earn_knockout({ coins: String(COIN_RULES.earnBack.knockoutWinner) })}
					</li>
					<li>{m.rules_coins_earn_streak({ coins: String(COIN_RULES.earnBack.streakBonus) })}</li>
				</ul>
			</div>
		</div>

		<p class="mt-4 text-sm text-subtle">{m.rules_coins_note()}</p>
	</section>

	<section class="card p-5 sm:p-6">
		<h2 class="section-title mb-3">{m.rules_leaderboard_title()}</h2>
		<ol class="list-decimal space-y-2 ps-5 text-sm text-muted">
			<li>{m.rules_leaderboard_points()}</li>
			<li>{m.rules_leaderboard_exact()}</li>
			<li>{m.rules_leaderboard_early()}</li>
		</ol>
	</section>

	<section class="card p-5 sm:p-6">
		<h2 class="section-title mb-3">{m.rules_public_title()}</h2>
		<ul class="list-disc space-y-2 ps-5 text-sm text-muted">
			<li>{m.rules_public_username()}</li>
			<li>{m.rules_public_predictions()}</li>
			<li>{m.rules_public_phone()}</li>
		</ul>
	</section>
</div>
