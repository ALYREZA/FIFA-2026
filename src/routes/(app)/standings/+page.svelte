<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	type PositionState = Record<string, number | null>;

	let positions = $state<Record<string, PositionState>>({});
	let saving = $state(false);
	let message = $state('');

	$effect(() => {
		const initial: Record<string, PositionState> = {};
		for (const group of data.groups ?? []) {
			initial[group.id] = {};
			for (const team of group.teams) {
				initial[group.id][team.id] = team.predictedPosition;
			}
		}
		positions = initial;
	});

	async function handleSave() {
		if (data.extrasLocked) return;
		saving = true;
		message = '';

		const predictions = Object.entries(positions).flatMap(([groupId, teamPositions]) =>
			Object.entries(teamPositions)
				.filter(([, pos]) => pos !== null)
				.map(([teamId, predictedPosition]) => ({
					groupId,
					teamId,
					predictedPosition: predictedPosition!
				}))
		);

		const form = new FormData();
		form.set('predictions', JSON.stringify(predictions));

		const res = await fetch('?/save', { method: 'POST', body: form });
		saving = false;

		if (res.ok) {
			message = 'Standings saved';
			await invalidateAll();
		} else {
			message = 'Failed to save';
		}
	}
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-white">Group standings</h1>
		<p class="mt-1 text-sm text-slate-400">
			Predict final positions (1–4) for each team in every group.
		</p>
	</div>

	{#if data.extrasLocked}
		<p class="rounded-lg border border-amber-900/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-300">
			Group standings are locked.
		</p>
	{/if}

	{#each data.groups ?? [] as group (group.id)}
		<section class="rounded-xl border border-slate-800 bg-slate-900 p-6">
			<h2 class="mb-4 text-lg font-semibold text-emerald-400">Group {group.id}</h2>
			<div class="space-y-3">
				{#each group.teams as team (team.id)}
					<div class="flex items-center justify-between rounded-lg bg-slate-800/50 px-4 py-3">
						<span>
							{team.flagEmoji}
							{team.name}
						</span>
						<select
							disabled={data.extrasLocked}
							value={positions[group.id]?.[team.id] ?? ''}
							onchange={(e) => {
								const val = e.currentTarget.value;
								positions[group.id][team.id] = val ? Number(val) : null;
							}}
							class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm disabled:opacity-50"
						>
							<option value="">—</option>
							{#each [1, 2, 3, 4] as pos (pos)}
								<option value={pos}>{pos}</option>
							{/each}
						</select>
					</div>
				{/each}
			</div>
		</section>
	{/each}

	<div class="flex items-center gap-4">
		<button
			type="button"
			disabled={data.extrasLocked || saving}
			onclick={handleSave}
			class="rounded-lg bg-emerald-600 px-6 py-2 text-white hover:bg-emerald-500 disabled:opacity-50"
		>
			{saving ? 'Saving...' : 'Save standings'}
		</button>
		{#if message}
			<span class="text-sm text-emerald-400">{message}</span>
		{/if}
	</div>
</div>
