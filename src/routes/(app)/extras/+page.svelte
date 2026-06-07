<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	let championTeamId = $state('');
	let runnerUpTeamId = $state('');
	let topScorerName = $state('');
	let darkHorseTeamId = $state('');

	$effect(() => {
		championTeamId = data.extras?.championTeamId ?? '';
		runnerUpTeamId = data.extras?.runnerUpTeamId ?? '';
		topScorerName = data.extras?.topScorerName ?? '';
		darkHorseTeamId = data.extras?.darkHorseTeamId ?? '';
	});
	let saving = $state(false);
	let message = $state('');

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
			message = 'Extras saved';
			await invalidateAll();
		} else {
			message = 'Failed to save — check your picks';
		}
	}
</script>

<div class="mx-auto max-w-lg space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-white">Tournament extras</h1>
		<p class="mt-1 text-sm text-slate-400">
			Champion, runner-up, top scorer, and dark horse picks. Locked at tournament start.
		</p>
	</div>

	{#if data.locked}
		<p class="rounded-lg border border-amber-900/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-300">
			Extras are locked.
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
			<label for="champion" class="mb-1 block text-sm text-slate-300">Champion</label>
			<select
				id="champion"
				bind:value={championTeamId}
				disabled={data.locked}
				required
				class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 disabled:opacity-50"
			>
				<option value="">Select team</option>
				{#each data.teams ?? [] as team (team.id)}
					<option value={team.id}>{team.flagEmoji} {team.name}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="runnerUp" class="mb-1 block text-sm text-slate-300">Runner-up</label>
			<select
				id="runnerUp"
				bind:value={runnerUpTeamId}
				disabled={data.locked}
				class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 disabled:opacity-50"
			>
				<option value="">Select team</option>
				{#each data.teams ?? [] as team (team.id)}
					<option value={team.id}>{team.flagEmoji} {team.name}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="topScorer" class="mb-1 block text-sm text-slate-300">Top scorer</label>
			<input
				id="topScorer"
				type="text"
				bind:value={topScorerName}
				disabled={data.locked}
				placeholder="Player name"
				class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 disabled:opacity-50"
			/>
		</div>

		<div>
			<label for="darkHorse" class="mb-1 block text-sm text-slate-300">Dark horse</label>
			<select
				id="darkHorse"
				bind:value={darkHorseTeamId}
				disabled={data.locked}
				class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 disabled:opacity-50"
			>
				<option value="">Select team</option>
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
			{saving ? 'Saving...' : 'Save extras'}
		</button>

		{#if message}
			<p class="text-center text-sm text-emerald-400">{message}</p>
		{/if}
	</form>
</div>
