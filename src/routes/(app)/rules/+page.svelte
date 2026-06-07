<script lang="ts">
	import GameRules from '$lib/components/GameRules.svelte';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	const lockMinutes = $derived(data.tournament?.lockMinutesBeforeKickoff ?? 15);
</script>

<div class="space-y-8">
	<section>
		<h1 class="page-title">{m.rules_title()}</h1>
		<p class="page-desc">{m.rules_intro()}</p>
	</section>

	<GameRules {lockMinutes} />
</div>
