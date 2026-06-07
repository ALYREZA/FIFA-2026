<script lang="ts">
	import type { Pathname } from '$app/types';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { getLocale, locales, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	const localeLabels: Record<string, () => string> = {
		fa: m.locale_fa,
		en: m.locale_en
	};

	function handleLocaleChange(locale: string) {
		const href = localizeHref(page.url.pathname, { locale });
		window.location.href = resolve(href as Pathname);
	}
</script>

<div class="flex gap-1 rounded-lg border border-slate-700 p-0.5">
	{#each locales as locale (locale)}
		<button
			type="button"
			onclick={() => handleLocaleChange(locale)}
			class="rounded-md px-2 py-1 text-xs transition {getLocale() === locale
				? 'bg-emerald-700 text-white'
				: 'text-slate-400 hover:text-emerald-300'}"
		>
			{localeLabels[locale]?.() ?? locale}
		</button>
	{/each}
</div>
