<script lang="ts">
	import * as m from '$lib/paraglide/messages';

	type Team = { id: string; name: string; code: string; flagEmoji: string | null } | null;

	let {
		matchId,
		homeTeam,
		awayTeam,
		homeScore = 0,
		awayScore = 0,
		locked = false,
		isKnockout = false,
		kickoffAt,
		onSubmit
	}: {
		matchId: string;
		homeTeam: Team;
		awayTeam: Team;
		homeScore?: number;
		awayScore?: number;
		locked?: boolean;
		isKnockout?: boolean;
		kickoffAt: Date;
		onSubmit: (matchId: string, home: number, away: number) => Promise<void>;
	} = $props();

	let home = $state(0);
	let away = $state(0);
	let saving = $state(false);
	let message = $state('');

	$effect(() => {
		home = homeScore;
		away = awayScore;
	});

	async function handleSubmit() {
		if (locked) return;
		saving = true;
		message = '';
		await onSubmit(matchId, home, away);
		saving = false;
		message = m.match_saved();
		setTimeout(() => (message = ''), 2000);
	}
</script>

<div class="rounded-xl border border-slate-800 bg-slate-900 p-4">
	<div class="mb-3 flex items-center justify-between text-xs text-slate-500">
		<span>{kickoffAt.toLocaleString()}</span>
		{#if locked}
			<span class="text-amber-500">{m.match_locked()}</span>
		{/if}
	</div>

	<div class="flex items-center gap-3">
		<div class="flex flex-1 items-center gap-2">
			<span class="text-xl">{homeTeam?.flagEmoji ?? '⚽'}</span>
			<span class="font-medium">{homeTeam?.code ?? 'TBD'}</span>
			<input
				type="number"
				min="0"
				max="20"
				bind:value={home}
				disabled={locked}
				class="ms-auto w-14 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-center disabled:opacity-50"
			/>
		</div>

		<span class="text-slate-600">–</span>

		<div class="flex flex-1 items-center gap-2">
			<input
				type="number"
				min="0"
				max="20"
				bind:value={away}
				disabled={locked}
				class="w-14 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-center disabled:opacity-50"
			/>
			<span class="font-medium">{awayTeam?.code ?? 'TBD'}</span>
			<span class="text-xl">{awayTeam?.flagEmoji ?? '⚽'}</span>
		</div>
	</div>

	{#if isKnockout}
		<p class="mt-2 text-xs text-slate-500">{m.match_knockout_no_draw()}</p>
	{/if}

	<div class="mt-3 flex items-center justify-between">
		{#if message}
			<span class="text-xs text-emerald-400">{message}</span>
		{:else}
			<span></span>
		{/if}
		<button
			type="button"
			disabled={locked || saving}
			onclick={handleSubmit}
			class="rounded-lg bg-emerald-700 px-4 py-1.5 text-sm text-white hover:bg-emerald-600 disabled:opacity-50"
		>
			{saving ? m.match_saving() : m.match_save()}
		</button>
	</div>
</div>
