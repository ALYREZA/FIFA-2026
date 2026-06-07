<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';
	import * as m from '$lib/paraglide/messages';

	let { children, data } = $props();

	const navItems: { href: Pathname; label: () => string }[] = [
		{ href: '/dashboard', label: m.nav_dashboard },
		{ href: '/predict', label: m.nav_matches },
		{ href: '/standings', label: m.nav_standings },
		{ href: '/bracket', label: m.nav_bracket },
		{ href: '/extras', label: m.nav_extras },
		{ href: '/leaderboard', label: m.nav_leaderboard },
		{ href: '/rules', label: m.nav_rules }
	];

	function profileHref(username: string) {
		return resolve('/u/[username]', { username });
	}

	async function handleSignOut() {
		await authClient.signOut();
		window.location.href = resolve('/login');
	}
</script>

<div class="min-h-screen bg-background text-foreground">
	<header class="border-b border-header-border bg-header">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
			<div>
				<a href={resolve('/dashboard')} class="text-lg font-bold text-accent-text">
					{m.app_title()}
				</a>
				<p class="text-xs text-muted">{m.app_tagline()}</p>
			</div>

			<nav class="hidden gap-1 md:flex">
				{#each navItems as item (item.href)}
					<a
						href={resolve(item.href)}
						class="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-accent-muted hover:text-accent-text"
					>
						{item.label()}
					</a>
				{/each}
				{#if data.isAdmin}
					<a
						href={resolve('/admin/matches')}
						class="rounded-lg px-3 py-2 text-sm text-admin transition hover:bg-warning-bg"
					>
						{m.nav_admin()}
					</a>
				{/if}
			</nav>

			<div class="flex items-center gap-2">
				<LocaleSwitcher />
				{#if data.user?.username}
					<a
						href={resolve(profileHref(data.user.username))}
						class="hidden text-sm font-medium text-accent-text hover:underline sm:inline"
					>
						@{data.user.username}
					</a>
				{/if}
				<button type="button" onclick={handleSignOut} class="btn-ghost min-h-11">
					{m.sign_out()}
				</button>
			</div>
		</div>

		<nav class="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
			{#each navItems as item (item.href)}
				<a
					href={resolve(item.href)}
					class="whitespace-nowrap rounded-lg px-3 py-2 text-xs text-muted hover:bg-accent-muted hover:text-accent-text"
				>
					{item.label()}
				</a>
			{/each}
			{#if data.isAdmin}
				<a
					href={resolve('/admin/matches')}
					class="whitespace-nowrap rounded-lg px-3 py-2 text-xs text-admin hover:bg-warning-bg"
				>
					{m.nav_admin()}
				</a>
			{/if}
		</nav>
	</header>

	<main class="mx-auto max-w-6xl px-4 py-6">
		{@render children()}
	</main>
</div>
