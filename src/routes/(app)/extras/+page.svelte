<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	let championTeamId = $state('');
	let runnerUpTeamId = $state('');
	let topScorerName = $state('');
	let darkHorseTeamId = $state('');
	let saving = $state(false);
	let message = $state('');

	$effect(() => {
		championTeamId = data.extras?.championTeamId ?? '';
		runnerUpTeamId = data.extras?.runnerUpTeamId ?? '';
		topScorerName = data.extras?.topScorerName ?? '';
		darkHorseTeamId = data.extras?.darkHorseTeamId ?? '';
	});

	async function handleSave() {
		if (data.locked) return;
		saving = true;
		message = '';

		const form = new FormData();
		form.set('championTeamId', championTeamId);
		form.set('runnerUpTeamId', runnerUpTeamId);
		form.set('topScorerName', topScorerName);
		form.set('darkHorseTeamId', darkHorseTeamId);

		const res = await fetch('?/save', { method: 'POST', body: form });
		saving = false;

		if (res.ok) {
			message = m.extras_saved();
			await invalidateAll();
		} else {
			message = m.extras_failed();
		}
	}
</script>

<div class="mx-auto max-w-lg space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-white">{m.extras_title()}</h1>
		<p class="mt-1 text-sm text-slate-400">{m.extras_intro()}</p>
	</div>

	{#if data.locked}
		<p class="rounded-lg border border-amber-900/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-300">
			{m.extras_locked()}
		</p>
	{/if}

	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSave();
		}}
		class="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6"
	>
		<div>
			<label for="champion" class="mb-1 block text-sm text-slate-300">{m.extras_champion()}</label>
			<select
				id="champion"
				bind:value={championTeamId}
				disabled={data.locked}
				required
				class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 disabled:opacity-50"
			>
				<option value="">{m.extras_select_team()}</option>
				{#each data.teams ?? [] as team (team.id)}
					<option value={team.id}>{team.flagEmoji} {team.name}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="runnerUp" class="mb-1 block text-sm text-slate-300">{m.extras_runner_up()}</label>
			<select
				id="runnerUp"
				bind:value={runnerUpTeamId}
				disabled={data.locked}
				class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 disabled:opacity-50"
			>
				<option value="">{m.extras_select_team()}</option>
				{#each data.teams ?? [] as team (team.id)}
					<option value={team.id}>{team.flagEmoji} {team.name}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="topScorer" class="mb-1 block text-sm text-slate-300">{m.extras_top_scorer()}</label>
			<input
				id="topScorer"
				type="text"
				bind:value={topScorerName}
				disabled={data.locked}
				placeholder={m.extras_player_placeholder()}
				class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 disabled:opacity-50"
			/>
		</div>

		<div>
			<label for="darkHorse" class="mb-1 block text-sm text-slate-300">{m.extras_dark_horse()}</label>
			<select
				id="darkHorse"
				bind:value={darkHorseTeamId}
				disabled={data.locked}
				class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 disabled:opacity-50"
			>
				<option value="">{m.extras_select_team()}</option>
				{#each data.teams ?? [] as team (team.id)}
					<option value={team.id}>{team.flagEmoji} {team.name}</option>
				{/each}
			</select>
		</div>

		<button
			type="submit"
			disabled={data.locked || saving}
			class="w-full rounded-lg bg-emerald-600 py-2.5 text-white hover:bg-emerald-500 disabled:opacity-50"
		>
			{saving ? m.extras_saving() : m.extras_save()}
		</button>

		{#if message}
			<p class="text-center text-sm text-emerald-400">{message}</p>
		{/if}
	</form>
</div>
