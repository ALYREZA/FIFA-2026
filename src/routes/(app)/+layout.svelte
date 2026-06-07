<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	import { formatPhoneDisplay } from '$lib/phone';

	let { children, data } = $props();

	const navItems: { href: Pathname; label: string }[] = [
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/predict', label: 'Matches' },
		{ href: '/standings', label: 'Standings' },
		{ href: '/bracket', label: 'Bracket' },
		{ href: '/extras', label: 'Extras' },
		{ href: '/leaderboard', label: 'Leaderboard' }
	];

	async function handleSignOut() {
		await authClient.signOut();
		window.location.href = resolve('/login');
	}
</script>

<div class="min-h-screen bg-slate-950 text-slate-100">
	<header class="border-b border-emerald-900/50 bg-slate-900/80 backdrop-blur">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
			<div>
				<a href={resolve('/dashboard')} class="text-lg font-bold text-emerald-400">
					FIFA 2026 Forecast
				</a>
				<p class="text-xs text-slate-400">Prediction game — not gambling</p>
			</div>

			<nav class="hidden gap-1 md:flex">
				{#each navItems as item (item.href)}
					<a
						href={resolve(item.href)}
						class="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-emerald-950 hover:text-emerald-300"
					>
						{item.label}
					</a>
				{/each}
			</nav>

			<div class="flex items-center gap-3">
				{#if data.user?.phoneNumber}
					<span class="hidden text-sm text-slate-400 sm:inline">
						{formatPhoneDisplay(data.user.phoneNumber)}
					</span>
				{/if}
				<button
					type="button"
					onclick={handleSignOut}
					class="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-emerald-800 hover:text-emerald-300"
				>
					Sign out
				</button>
			</div>
		</div>

		<nav class="flex gap-1 overflow-x-auto border-t border-slate-800 px-4 py-2 md:hidden">
			{#each navItems as item (item.href)}
				<a
					href={resolve(item.href)}
					class="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:bg-emerald-950"
				>
					{item.label}
				</a>
			{/each}
		</nav>
	</header>

	<main class="mx-auto max-w-6xl px-4 py-8">
		{@render children()}
	</main>
</div>
