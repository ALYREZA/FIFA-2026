<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { initTelegramWebApp, isTelegramWebApp } from '$lib/telegram/webapp';
	import '$lib/flags/flag-icons-subset.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	$effect(() => {
		if (!isTelegramWebApp()) return;
		return initTelegramWebApp();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
