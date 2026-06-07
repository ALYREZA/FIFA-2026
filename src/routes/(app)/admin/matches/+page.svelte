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
		<h1 class="text-2xl font-bold text-white">{m.admin_matches()}</h1>
		<div class="flex flex-wrap gap-2">
			<a
				href={resolve('/admin/results')}
				class="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-emerald-800"
			>
				{m.admin_results()}
			</a>
			<button
				type="button"
				onclick={handleRescore}
				class="rounded-lg bg-emerald-800 px-3 py-1.5 text-sm text-white hover:bg-emerald-700"
			>
				{m.admin_rescore()}
			</button>
			<button
				type="button"
				onclick={handleReseed}
				class="rounded-lg border border-amber-800 px-3 py-1.5 text-sm text-amber-300 hover:bg-amber-950"
			>
				{m.admin_reseed()}
			</button>
		</div>
	</div>

	{#if form?.reseeded}
		<p class="rounded-lg bg-emerald-950 px-4 py-2 text-sm text-emerald-300">{m.admin_reseed_done()}</p>
	{/if}
	{#if form?.usersScored !== undefined}
		<p class="rounded-lg bg-emerald-950 px-4 py-2 text-sm text-emerald-300">
			{m.admin_rescore_done({ count: String(form.usersScored) })}
		</p>
	{/if}

	<div class="flex flex-wrap gap-2">
		<button
			type="button"
			onclick={() => filterStage('all')}
			class="rounded-lg px-3 py-1 text-xs {data.stageFilter === 'all'
				? 'bg-emerald-700 text-white'
				: 'bg-slate-800 text-slate-400'}"
		>
			{m.admin_filter_all()}
		</button>
		{#each data.stages ?? [] as stage (stage.id)}
			<button
				type="button"
				onclick={() => filterStage(stage.id)}
				class="rounded-lg px-3 py-1 text-xs {data.stageFilter === stage.id
					? 'bg-emerald-700 text-white'
					: 'bg-slate-800 text-slate-400'}"
			>
				{stage.name}
			</button>
		{/each}
	</div>

	<div class="space-y-3">
		{#each data.matches ?? [] as match (match.id)}
			{@const homeScore = match.homeScore ?? 0}
			{@const awayScore = match.awayScore ?? 0}
			<div class="rounded-xl border border-slate-800 bg-slate-900 p-4">
				<div class="mb-2 flex justify-between text-xs text-slate-500">
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
						class="w-14 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-center"
					/>
					<span class="text-slate-600">–</span>
					<input
						type="number"
						min="0"
						value={awayScore}
						id="away-{match.id}"
						class="w-14 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-center"
					/>
					<span class="min-w-24 text-sm">
						{match.awayTeam?.code ?? 'TBD'}
						{match.awayTeam?.flagEmoji ?? '—'}
					</span>
					<select
						id="status-{match.id}"
						class="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm"
					>
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
						class="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm text-white hover:bg-emerald-600"
					>
						{m.admin_save_result()}
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
