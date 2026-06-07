<script lang="ts">
	import { resolve } from '$app/paths';
	import { invalidateAll } from '$app/navigation';
	import * as m from '$lib/paraglide/messages';

	let { data, form } = $props();

	async function handleSaveResult(matchId: string, homeScore: number, awayScore: number, status: string) {
		const fd = new FormData();
		fd.set('matchId', matchId);
		fd.set('homeScore', String(homeScore));
		fd.set('awayScore', String(awayScore));
		fd.set('status', status);
		await fetch('?/saveResult', { method: 'POST', body: fd });
		await invalidateAll();
	}

	async function handleReseed() {
		if (!confirm(m.admin_reseed_confirm())) return;
		await fetch('?/reseed', { method: 'POST' });
		await invalidateAll();
	}

	async function handleRescore() {
		await fetch('?/rescore', { method: 'POST' });
		await invalidateAll();
	}

	function filterStage(stageId: string) {
		const url = new URL(window.location.href);
		if (stageId === 'all') url.searchParams.delete('stage');
		else url.searchParams.set('stage', stageId);
		window.location.href = url.pathname + url.search;
	}
</script>

<div class="space-y-6">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<h1 class="page-title">{m.admin_matches()}</h1>
		<div class="flex flex-wrap gap-2">
			<a href={resolve('/admin/results')} class="btn-ghost px-3 py-1.5 text-sm">
				{m.admin_results()}
			</a>
			<button type="button" onclick={handleRescore} class="btn-primary px-3 py-1.5 text-sm">
				{m.admin_rescore()}
			</button>
			<button type="button" onclick={handleReseed} class="btn-admin px-3 py-1.5 text-sm">
				{m.admin_reseed()}
			</button>
		</div>
	</div>

	{#if form?.reseeded}
		<p class="alert-success px-4 py-2">{m.admin_reseed_done()}</p>
	{/if}
	{#if form?.usersScored !== undefined}
		<p class="alert-success px-4 py-2">
			{m.admin_rescore_done({ count: String(form.usersScored) })}
		</p>
	{/if}

	<div class="flex flex-wrap gap-2">
		<button
			type="button"
			onclick={() => filterStage('all')}
			class={data.stageFilter === 'all' ? 'chip-active' : 'chip-inactive'}
		>
			{m.admin_filter_all()}
		</button>
		{#each data.stages ?? [] as stage (stage.id)}
			<button
				type="button"
				onclick={() => filterStage(stage.id)}
				class={data.stageFilter === stage.id ? 'chip-active' : 'chip-inactive'}
			>
				{stage.name}
			</button>
		{/each}
	</div>

	<div class="space-y-3">
		{#each data.matches ?? [] as match (match.id)}
			{@const homeScore = match.homeScore ?? 0}
			{@const awayScore = match.awayScore ?? 0}
			<div class="card p-4">
				<div class="mb-2 flex justify-between text-xs text-subtle">
					<span>{match.stage?.name}</span>
					<span>{match.kickoffAt.toLocaleString()}</span>
				</div>
				<div class="flex flex-wrap items-center gap-3">
					<span class="min-w-24 text-sm">
						{match.homeTeam?.flagEmoji ?? '—'}
						{match.homeTeam?.code ?? 'TBD'}
					</span>
					<input
						type="number"
						min="0"
						value={homeScore}
						id="home-{match.id}"
						class="input w-14 px-2 py-1 text-center"
					/>
					<span class="text-subtle">–</span>
					<input
						type="number"
						min="0"
						value={awayScore}
						id="away-{match.id}"
						class="input w-14 px-2 py-1 text-center"
					/>
					<span class="min-w-24 text-sm">
						{match.awayTeam?.code ?? 'TBD'}
						{match.awayTeam?.flagEmoji ?? '—'}
					</span>
					<select id="status-{match.id}" class="input px-2 py-1 text-sm">
						<option value="scheduled" selected={match.status === 'scheduled'}>scheduled</option>
						<option value="live" selected={match.status === 'live'}>live</option>
						<option value="finished" selected={match.status === 'finished'}>finished</option>
					</select>
					<button
						type="button"
						onclick={() => {
							const home = Number((document.getElementById(`home-${match.id}`) as HTMLInputElement).value);
							const away = Number((document.getElementById(`away-${match.id}`) as HTMLInputElement).value);
							const status = (document.getElementById(`status-${match.id}`) as HTMLSelectElement).value;
							handleSaveResult(match.id, home, away, status);
						}}
						class="btn-primary px-3 py-1.5 text-sm"
					>
						{m.admin_save_result()}
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
