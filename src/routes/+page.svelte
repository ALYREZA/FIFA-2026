<script lang="ts">
	import { resolve } from '$app/paths';
	import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<div
	class="safe-area-top safe-area-bottom safe-area-x flex h-dvh flex-col overflow-hidden bg-background text-foreground"
>
	<header class="flex shrink-0 items-center justify-end py-3">
		<LocaleSwitcher />
	</header>

	<main class="flex flex-1 flex-col items-center justify-center px-4 pb-8 text-center">
		<h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
			{m.app_title()}
		</h1>
		<p class="mt-3 max-w-sm text-sm text-muted sm:text-base">{m.app_tagline()}</p>
		<a href={resolve('/login')} class="btn-primary mt-8 px-8 py-3 text-sm">
			{m.home_get_started()}
		</a>
	</main>
</div>
