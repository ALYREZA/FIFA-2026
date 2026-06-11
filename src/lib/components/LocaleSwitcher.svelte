<script lang="ts">
	import { getLocale, locales, setLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	const localeLabels: Record<string, () => string> = {
		fa: m.locale_fa,
		en: m.locale_en
	};

	type AppLocale = (typeof locales)[number];

	function handleLocaleChange(locale: AppLocale) {
		if (getLocale() === locale) return;
		setLocale(locale);
	}
</script>

<div class="flex gap-1 rounded-lg border border-border p-0.5">
	{#each locales as locale (locale)}
		<button
			type="button"
			onclick={() => handleLocaleChange(locale)}
			class="rounded-md px-2 py-1 text-xs transition {getLocale() === locale
				? 'bg-accent text-on-accent'
				: 'text-muted hover:text-accent-text'}"
		>
			{localeLabels[locale]?.() ?? locale}
		</button>
	{/each}
</div>
