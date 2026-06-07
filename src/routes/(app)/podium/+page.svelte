<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import CountryFlag from '$lib/components/CountryFlag.svelte';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	let firstPlaceTeamId = $state('');
	let secondPlaceTeamId = $state('');
	let thirdPlaceTeamId = $state('');
	let saving = $state(false);
	let message = $state('');

	const isLocked = $derived(data.pricing ? new Date() >= data.pricing.locksAt : false);
	const isSubmitted = $derived(!!data.podium);
	const canSubmit = $derived(!isLocked && !isSubmitted && !saving);

	function teamById(id: string | null | undefined) {
		return data.teams?.find((t) => t.id === id) ?? null;
	}

	async function handleSubmit() {
		if (!canSubmit) return;
		saving = true;
		message = '';

		const form = new FormData();
		form.set('firstPlaceTeamId', firstPlaceTeamId);
		form.set('secondPlaceTeamId', secondPlaceTeamId);
		form.set('thirdPlaceTeamId', thirdPlaceTeamId);

		const res = await fetch('?/submit', { method: 'POST', body: form });
		saving = false;

		if (res.ok) {
			message = m.podium_saved();
			await invalidateAll();
		} else {
			const body = (await res.json()) as { data?: { error?: string } };
			message = body.data?.error ?? m.podium_failed();
		}
	}
</script>

<div class="mx-auto max-w-lg space-y-6">
	<div>
		<h1 class="page-title">{m.podium_title()}</h1>
		<p class="page-desc">{m.podium_intro()}</p>
	</div>

	{#if data.pricing}
		<div class="card flex flex-wrap items-center justify-between gap-3 p-4">
			<div>
				<p class="text-sm text-muted">{m.podium_current_cost()}</p>
				<p class="text-2xl font-bold text-accent-text">
					{data.pricing.currentCost}
					{m.podium_coins()}
				</p>
			</div>
			<div class="text-end">
				<p class="text-sm text-muted">{m.podium_your_balance()}</p>
				<p class="text-lg font-semibold text-foreground">{data.pricing.coinBalance}</p>
			</div>
		</div>

		<p class="text-sm text-subtle">
			{m.podium_price_decay({
				max: String(data.maxCoinCost),
				min: String(data.minCoinCost),
				lockDate: data.pricing.locksAt.toLocaleDateString()
			})}
		</p>
	{/if}

	{#if isSubmitted && data.podium}
		<div class="alert-warning px-4 py-3">
			<p class="font-medium">{m.podium_locked_forever()}</p>
			<p class="mt-1 text-sm">{m.podium_spent({ coins: String(data.podium.coinsSpent) })}</p>
		</div>

		<div class="card space-y-4 p-5 sm:p-6">
			<div class="list-row flex items-center justify-between px-4 py-3">
				<span class="text-sm text-muted">{m.podium_first()}</span>
				<span class="flex items-center gap-2 font-medium">
					<CountryFlag teamId={data.podium.firstPlaceTeamId} />
					{teamById(data.podium.firstPlaceTeamId)?.code}
				</span>
			</div>
			<div class="list-row flex items-center justify-between px-4 py-3">
				<span class="text-sm text-muted">{m.podium_second()}</span>
				<span class="flex items-center gap-2 font-medium">
					<CountryFlag teamId={data.podium.secondPlaceTeamId} />
					{teamById(data.podium.secondPlaceTeamId)?.code}
				</span>
			</div>
			<div class="list-row flex items-center justify-between px-4 py-3">
				<span class="text-sm text-muted">{m.podium_third()}</span>
				<span class="flex items-center gap-2 font-medium">
					<CountryFlag teamId={data.podium.thirdPlaceTeamId} />
					{teamById(data.podium.thirdPlaceTeamId)?.code}
				</span>
			</div>
		</div>
	{:else if isLocked}
		<p class="alert-warning px-4 py-3">{m.podium_closed()}</p>
	{:else}
		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			class="card space-y-4 p-5 sm:p-6"
		>
			<p class="text-sm text-muted">{m.podium_no_edit_warning()}</p>

			<div>
				<label for="first" class="label">{m.podium_first()}</label>
				<select id="first" bind:value={firstPlaceTeamId} required class="input w-full py-2">
					<option value="">{m.extras_select_team()}</option>
					{#each data.teams ?? [] as team (team.id)}
						<option value={team.id}>{team.code} · {team.name}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="second" class="label">{m.podium_second()}</label>
				<select id="second" bind:value={secondPlaceTeamId} required class="input w-full py-2">
					<option value="">{m.extras_select_team()}</option>
					{#each data.teams ?? [] as team (team.id)}
						<option value={team.id}>{team.code} · {team.name}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="third" class="label">{m.podium_third()}</label>
				<select id="third" bind:value={thirdPlaceTeamId} required class="input w-full py-2">
					<option value="">{m.extras_select_team()}</option>
					{#each data.teams ?? [] as team (team.id)}
						<option value={team.id}>{team.code} · {team.name}</option>
					{/each}
				</select>
			</div>

			<button type="submit" disabled={!canSubmit} class="btn-primary w-full py-2.5">
				{saving
					? m.podium_submitting()
					: m.podium_submit({ coins: String(data.pricing?.currentCost ?? 0) })}
			</button>

			{#if message}
				<p class="text-center text-sm text-accent-text">{message}</p>
			{/if}
		</form>
	{/if}
</div>
