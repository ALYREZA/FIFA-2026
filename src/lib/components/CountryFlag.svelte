<script lang="ts">
	import { getTeamFlagCode } from '$lib/flags/team-flag-codes';

	let {
		teamId = null,
		countryCode = null,
		squared = false,
		class: className = ''
	}: {
		teamId?: string | null;
		countryCode?: string | null;
		squared?: boolean;
		class?: string;
	} = $props();

	let code = $derived(countryCode ?? (teamId ? getTeamFlagCode(teamId) : null));
</script>

{#if code}
	<span class={['fi', `fi-${code}`, squared && 'fis', className]} aria-hidden="true"></span>
{:else}
	<span class={className} aria-hidden="true">⚽</span>
{/if}
