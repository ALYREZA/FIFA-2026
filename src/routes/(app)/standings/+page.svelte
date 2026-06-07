<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import * as m from '$lib/paraglide/messages';

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
			message = m.standings_saved();
			await invalidateAll();
		} else {
			message = m.standings_failed();
		}
	}
</script>

<div class="space-y-6">
	<div>
		<h1 class="page-title">{m.standings_title()}</h1>
		<p class="page-desc">{m.standings_intro()}</p>
	</div>

	{#if data.extrasLocked}
		<p class="alert-warning px-4 py-3">{m.standings_locked()}</p>
	{/if}

	{#each data.groups ?? [] as group (group.id)}
		<section class="card p-5 sm:p-6">
			<h2 class="section-title mb-4">
				{m.standings_group({ group: group.id })}
			</h2>
			<div class="space-y-3">
				{#each group.teams as team (team.id)}
					<div class="list-row flex items-center justify-between px-4 py-3">
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
							class="input px-3 py-1.5 text-sm"
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
			class="btn-primary px-6 py-2"
		>
			{saving ? m.standings_saving() : m.standings_save()}
		</button>
		{#if message}
			<span class="text-sm text-accent-text">{message}</span>
		{/if}
	</div>
</div>
