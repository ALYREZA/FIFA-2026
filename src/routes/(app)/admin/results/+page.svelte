<script lang="ts">
	import { resolve } from '$app/paths';
	import { invalidateAll } from '$app/navigation';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	let positions = $state<Record<string, Record<string, number | null>>>({});
	let championTeamId = $state('');
	let runnerUpTeamId = $state('');
	let topScorerName = $state('');
	let darkHorseTeamId = $state('');
	let message = $state('');

	$effect(() => {
		const initial: Record<string, Record<string, number | null>> = {};
		for (const group of data.groups ?? []) {
			initial[group.id] = {};
			for (const team of group.teams) {
				initial[group.id][team.id] = team.actualPosition;
			}
		}
		positions = initial;
		championTeamId = data.extras?.championTeamId ?? '';
		runnerUpTeamId = data.extras?.runnerUpTeamId ?? '';
		topScorerName = data.extras?.topScorerName ?? '';
		darkHorseTeamId = data.extras?.darkHorseTeamId ?? '';
	});

	async function handleSaveStandings() {
		const standings = Object.entries(positions).flatMap(([groupId, teamPositions]) =>
			Object.entries(teamPositions)
				.filter(([, pos]) => pos !== null)
				.map(([teamId, actualPosition]) => ({
					groupId,
					teamId,
					actualPosition: actualPosition!
				}))
		);
		const form = new FormData();
		form.set('standings', JSON.stringify(standings));
		await fetch('?/saveStandings', { method: 'POST', body: form });
		message = m.admin_save_standings();
		await invalidateAll();
	}

	async function handleSaveExtras() {
		const form = new FormData();
		form.set('championTeamId', championTeamId);
		form.set('runnerUpTeamId', runnerUpTeamId);
		form.set('topScorerName', topScorerName);
		form.set('darkHorseTeamId', darkHorseTeamId);
		await fetch('?/saveExtras', { method: 'POST', body: form });
		message = m.admin_save_extras();
		await invalidateAll();
	}
</script>

<div class="space-y-8">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-white">{m.admin_results()}</h1>
		<a href={resolve('/admin/matches')} class="text-sm text-emerald-400 hover:text-emerald-300">
			← {m.admin_matches()}
		</a>
	</div>

	{#if message}
		<p class="text-sm text-emerald-400">{message}</p>
	{/if}

	<section class="space-y-4">
		<h2 class="text-lg font-semibold text-emerald-400">{m.admin_save_standings()}</h2>
		{#each data.groups ?? [] as group (group.id)}
			<div class="rounded-xl border border-slate-800 bg-slate-900 p-4">
				<h3 class="mb-3 font-medium">{m.standings_group({ group: group.id })}</h3>
				<div class="space-y-2">
					{#each group.teams as team (team.id)}
						<div class="flex items-center justify-between rounded-lg bg-slate-800/50 px-3 py-2">
							<span>{team.flagEmoji} {team.name}</span>
							<select
								value={positions[group.id]?.[team.id] ?? ''}
								onchange={(e) => {
									const val = e.currentTarget.value;
									positions[group.id][team.id] = val ? Number(val) : null;
								}}
								class="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm"
							>
								<option value="">—</option>
								{#each [1, 2, 3, 4] as pos (pos)}
									<option value={pos}>{pos}</option>
								{/each}
							</select>
						</div>
					{/each}
				</div>
			</div>
		{/each}
		<button
			type="button"
			onclick={handleSaveStandings}
			class="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500"
		>
			{m.admin_save_standings()}
		</button>
	</section>

	<section class="mx-auto max-w-md space-y-4">
		<h2 class="text-lg font-semibold text-emerald-400">{m.admin_save_extras()}</h2>
		<div class="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
			<div>
				<label for="admin-champion" class="mb-1 block text-sm text-slate-400">{m.extras_champion()}</label>
				<select id="admin-champion" bind:value={championTeamId} class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
					<option value="">{m.extras_select_team()}</option>
					{#each data.groups?.flatMap((g) => g.teams) ?? [] as team (team.id)}
						<option value={team.id}>{team.flagEmoji} {team.name}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="admin-runner-up" class="mb-1 block text-sm text-slate-400">{m.extras_runner_up()}</label>
				<select id="admin-runner-up" bind:value={runnerUpTeamId} class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
					<option value="">{m.extras_select_team()}</option>
					{#each data.groups?.flatMap((g) => g.teams) ?? [] as team (team.id)}
						<option value={team.id}>{team.flagEmoji} {team.name}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="admin-top-scorer" class="mb-1 block text-sm text-slate-400">{m.extras_top_scorer()}</label>
				<input
					id="admin-top-scorer"
					type="text"
					bind:value={topScorerName}
					placeholder={m.extras_player_placeholder()}
					class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
				/>
			</div>
			<div>
				<label for="admin-dark-horse" class="mb-1 block text-sm text-slate-400">{m.extras_dark_horse()}</label>
				<select id="admin-dark-horse" bind:value={darkHorseTeamId} class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
					<option value="">{m.extras_select_team()}</option>
					{#each data.groups?.flatMap((g) => g.teams) ?? [] as team (team.id)}
						<option value={team.id}>{team.flagEmoji} {team.name}</option>
					{/each}
				</select>
			</div>
			<button
				type="button"
				onclick={handleSaveExtras}
				class="w-full rounded-lg bg-emerald-600 py-2 text-white hover:bg-emerald-500"
			>
				{m.admin_save_extras()}
			</button>
		</div>
	</section>
</div>
