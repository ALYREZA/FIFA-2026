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
		<h1 class="page-title">{m.extras_title()}</h1>
		<p class="page-desc">{m.extras_intro()}</p>
	</div>

	{#if data.locked}
		<p class="alert-warning px-4 py-3">{m.extras_locked()}</p>
	{/if}

	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSave();
		}}
		class="card space-y-4 p-5 sm:p-6"
	>
		<div>
			<label for="champion" class="label">{m.extras_champion()}</label>
			<select
				id="champion"
				bind:value={championTeamId}
				disabled={data.locked}
				required
				class="input w-full py-2"
			>
				<option value="">{m.extras_select_team()}</option>
				{#each data.teams ?? [] as team (team.id)}
					<option value={team.id}>{team.code} · {team.name}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="runnerUp" class="label">{m.extras_runner_up()}</label>
			<select
				id="runnerUp"
				bind:value={runnerUpTeamId}
				disabled={data.locked}
				class="input w-full py-2"
			>
				<option value="">{m.extras_select_team()}</option>
				{#each data.teams ?? [] as team (team.id)}
					<option value={team.id}>{team.code} · {team.name}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="topScorer" class="label">{m.extras_top_scorer()}</label>
			<input
				id="topScorer"
				type="text"
				bind:value={topScorerName}
				disabled={data.locked}
				placeholder={m.extras_player_placeholder()}
				class="input w-full py-2"
			/>
		</div>

		<div>
			<label for="darkHorse" class="label">{m.extras_dark_horse()}</label>
			<select
				id="darkHorse"
				bind:value={darkHorseTeamId}
				disabled={data.locked}
				class="input w-full py-2"
			>
				<option value="">{m.extras_select_team()}</option>
				{#each data.teams ?? [] as team (team.id)}
					<option value={team.id}>{team.code} · {team.name}</option>
				{/each}
			</select>
		</div>

		<button type="submit" disabled={data.locked || saving} class="btn-primary w-full py-2.5">
			{saving ? m.extras_saving() : m.extras_save()}
		</button>

		{#if message}
			<p class="text-center text-sm text-accent-text">{message}</p>
		{/if}
	</form>
</div>
