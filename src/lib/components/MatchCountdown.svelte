<script lang="ts">
	import { browser } from '$app/environment';
	import { getLocale } from '$lib/paraglide/runtime';
	import { coerceDate, formatKickoffAt } from '$lib/format-datetime';
	import { countdownTickMs, formatCountdown } from '$lib/format-countdown';

	let { kickoffAt, class: className = '' }: { kickoffAt: Date | string | number; class?: string } =
		$props();

	let kickoff = $derived(coerceDate(kickoffAt));
	let now = $state(new Date());
	let label = $derived(formatCountdown(kickoff, now, getLocale()));
	let localKickoff = $derived(formatKickoffAt(kickoff, getLocale()));

	$effect(() => {
		const kickoffMs = kickoff.getTime();
		let timeout: ReturnType<typeof setTimeout>;

		function schedule() {
			now = new Date();
			const delay = countdownTickMs(new Date(kickoffMs), now);
			timeout = setTimeout(schedule, delay);
		}

		schedule();
		return () => clearTimeout(timeout);
	});
</script>

<time datetime={kickoff.toISOString()} class={className} title={browser ? localKickoff : undefined}>
	{#if browser}
		{localKickoff} · {label}
	{:else}
		{label}
	{/if}
</time>
