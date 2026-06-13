<script lang="ts">
	import type { Pathname } from '$app/types';
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';
	import NavIcon, { type NavIconName } from '$lib/components/NavIcon.svelte';
	import * as m from '$lib/paraglide/messages';

	type NavItem = {
		href: Pathname;
		label: () => string;
		icon: NavIconName;
	};

	let { isAdmin, username }: { isAdmin: boolean; username?: string | null } = $props();

	const primaryNav: NavItem[] = [
		{ href: '/dashboard', label: m.nav_dashboard, icon: 'home' },
		{ href: '/predict', label: m.nav_matches, icon: 'predict' },
		{ href: '/standings', label: m.nav_standings, icon: 'standings' },
		{ href: '/bracket', label: m.nav_bracket, icon: 'bracket' },
		{ href: '/leaderboard', label: m.nav_leaderboard, icon: 'leaderboard' }
	];

	const secondaryNav: NavItem[] = [
		{ href: '/extras', label: m.nav_extras, icon: 'extras' },
		{ href: '/podium', label: m.nav_podium, icon: 'podium' },
		{ href: '/rules', label: m.nav_rules, icon: 'rules' }
	];

	const adminNav: NavItem = {
		href: '/admin/matches',
		label: m.nav_admin,
		icon: 'admin'
	};

	const mobileNav: NavItem[] = [
		{ href: '/predict', label: m.nav_matches, icon: 'predict' },
		{ href: '/standings', label: m.nav_standings, icon: 'standings' },
		{ href: '/bracket', label: m.nav_bracket, icon: 'bracket' },
		{ href: '/leaderboard', label: m.nav_leaderboard, icon: 'leaderboard' }
	];

	let desktopMoreOpen = $state(false);
	let mobileMoreOpen = $state(false);
	let userOpen = $state(false);

	function normalizePath(pathname: string): string {
		return pathname.replace(/^\/(en|fa)(?=\/|$)/, '') || '/';
	}

	function isActive(href: Pathname, pathname: string): boolean {
		const path = normalizePath(pathname);
		if (href === '/dashboard') return path === '/dashboard';
		if (href.startsWith('/admin')) return path.startsWith('/admin');
		return path === href || path.startsWith(`${href}/`);
	}

	function isSecondaryActive(pathname: string): boolean {
		const items = isAdmin ? [...secondaryNav, adminNav] : secondaryNav;
		return items.some((item) => isActive(item.href, pathname));
	}

	function profileHref(user: string): Pathname {
		return `/u/${user}` as Pathname;
	}

	function closeMenus() {
		desktopMoreOpen = false;
		mobileMoreOpen = false;
		userOpen = false;
	}

	function handleWindowClick(event: MouseEvent) {
		if (!desktopMoreOpen && !mobileMoreOpen && !userOpen) return;
		const target = event.target;
		if (target instanceof Element && target.closest('[data-nav-dropdown]')) return;
		closeMenus();
	}

	function toggleDesktopMore(event: MouseEvent) {
		event.stopPropagation();
		userOpen = false;
		mobileMoreOpen = false;
		desktopMoreOpen = !desktopMoreOpen;
	}

	function toggleMobileMore(event: MouseEvent) {
		event.stopPropagation();
		userOpen = false;
		desktopMoreOpen = false;
		mobileMoreOpen = !mobileMoreOpen;
	}

	function toggleUserMenu(event: MouseEvent) {
		event.stopPropagation();
		desktopMoreOpen = false;
		mobileMoreOpen = false;
		userOpen = !userOpen;
	}

	afterNavigate(() => {
		closeMenus();
	});

	async function handleSignOut() {
		closeMenus();
		await authClient.signOut();
		window.location.href = resolve('/login');
	}

	function mobileTabClass(active: boolean): string {
		return `${mobileTabItemClass} ${active ? mobileActiveClass : mobileIdleClass}`;
	}

	const navLinkClass =
		'flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm transition lg:px-3';
	const navActiveClass = 'bg-accent-muted font-medium text-accent-text';
	const navIdleClass = 'text-muted hover:bg-accent-muted/60 hover:text-accent-text';

	const mobileTabBaseClass =
		'flex min-w-0 min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-2 text-[10px] leading-tight transition sm:min-h-12 sm:text-xs';
	const mobileTabItemClass = `${mobileTabBaseClass} flex-1`;
	const mobileActiveClass = 'bg-accent-muted font-medium text-accent-text';
	const mobileIdleClass = 'text-muted';
</script>

<svelte:window onclick={handleWindowClick} />

<header
	class="safe-area-top safe-area-x sticky top-0 z-40 border-b border-header-border bg-header/95 backdrop-blur-sm"
>
	<div class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
		<a href={resolve('/dashboard')} class="shrink-0">
			<span class="text-base font-bold text-accent-text sm:text-lg">{m.app_title()}</span>
		</a>

		<nav
			class="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex"
			aria-label="Main"
		>
			{#each primaryNav as item (item.href)}
				{@const active = isActive(item.href, page.url.pathname)}
				<a
					href={resolve(item.href)}
					class="{navLinkClass} {active ? navActiveClass : navIdleClass}"
					aria-current={active ? 'page' : undefined}
					title={item.label()}
				>
					<NavIcon name={item.icon} class="size-4 shrink-0" />
					<span class="hidden xl:inline">{item.label()}</span>
				</a>
			{/each}

			<div class="relative" data-nav-dropdown>
				<button
					type="button"
					class="{navLinkClass} {isSecondaryActive(page.url.pathname)
						? navActiveClass
						: navIdleClass}"
					aria-expanded={desktopMoreOpen}
					aria-haspopup="menu"
					onclick={toggleDesktopMore}
				>
					<NavIcon name="more" class="size-4 shrink-0" />
					<span class="hidden xl:inline">{m.nav_more()}</span>
				</button>

				{#if desktopMoreOpen}
					<div
						class="absolute start-0 top-full z-50 mt-1 min-w-44 rounded-xl border border-border bg-card p-1 shadow-lg"
						role="menu"
					>
						{#each secondaryNav as item (item.href)}
							{@const active = isActive(item.href, page.url.pathname)}
							<a
								href={resolve(item.href)}
								class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition {active
									? 'bg-accent-muted font-medium text-accent-text'
									: 'text-muted hover:bg-accent-muted/60 hover:text-accent-text'}"
								aria-current={active ? 'page' : undefined}
								onclick={closeMenus}
							>
								<NavIcon name={item.icon} class="size-4 shrink-0" />
								{item.label()}
							</a>
						{/each}
						{#if isAdmin}
							{@const active = isActive(adminNav.href, page.url.pathname)}
							<a
								href={resolve(adminNav.href)}
								class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition {active
									? 'bg-warning-bg font-medium text-admin'
									: 'text-admin hover:bg-warning-bg'}"
								aria-current={active ? 'page' : undefined}
								onclick={closeMenus}
							>
								<NavIcon name={adminNav.icon} class="size-4 shrink-0" />
								{adminNav.label()}
							</a>
						{/if}
					</div>
				{/if}
			</div>
		</nav>

		<div class="ms-auto flex shrink-0 items-center gap-2">
			<div class="lg:hidden">
				<LocaleSwitcher />
			</div>

			<div class="relative" data-nav-dropdown>
				<button
					type="button"
					class="flex min-h-11 items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-sm text-muted transition hover:border-accent hover:text-accent-text"
					aria-expanded={userOpen}
					aria-haspopup="menu"
					aria-label={username ? `@${username}` : m.nav_account()}
					onclick={toggleUserMenu}
				>
					<NavIcon name="user" class="size-4 shrink-0" />
					{#if username}
						<span class="hidden max-w-24 truncate font-medium sm:inline">@{username}</span>
					{/if}
				</button>

				{#if userOpen}
					<div
						class="absolute end-0 top-full z-50 mt-1 w-52 rounded-xl border border-border bg-card p-2 shadow-lg"
					>
						{#if username}
							<a
								href={resolve(profileHref(username))}
								class="mb-2 block rounded-lg px-3 py-2 text-sm font-medium text-accent-text hover:bg-accent-muted/60"
								onclick={closeMenus}
							>
								@{username}
							</a>
						{/if}
						<div class="mb-2 hidden px-1 lg:block">
							<p class="mb-1.5 px-2 text-xs text-subtle">{m.nav_language()}</p>
							<LocaleSwitcher />
						</div>
						<button type="button" class="btn-ghost min-h-11 w-full text-sm" onclick={handleSignOut}>
							{m.sign_out()}
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</header>

{#if mobileMoreOpen}
	<div class="fixed inset-0 z-40 lg:hidden" role="presentation" onclick={closeMenus}></div>
{/if}

<nav
	class="safe-area-x safe-area-bottom fixed inset-x-0 bottom-0 z-50 border-t border-border bg-header/95 px-2 py-1 backdrop-blur-sm lg:hidden"
	aria-label="Main"
>
	<div class="mx-auto flex max-w-6xl items-stretch gap-0.5">
		<a
			href={resolve('/dashboard')}
			class={mobileTabClass(isActive('/dashboard', page.url.pathname))}
			aria-current={isActive('/dashboard', page.url.pathname) ? 'page' : undefined}
			aria-label={m.nav_dashboard()}
			title={m.nav_dashboard()}
		>
			<NavIcon name="home" class="size-5 shrink-0 sm:size-6" />
			<span class="hidden max-w-full truncate sm:block">{m.nav_dashboard()}</span>
		</a>

		{#each mobileNav as item (item.href)}
			{@const active = isActive(item.href, page.url.pathname)}
			<a
				href={resolve(item.href)}
				class={mobileTabClass(active)}
				aria-current={active ? 'page' : undefined}
				aria-label={item.label()}
				title={item.label()}
			>
				<NavIcon name={item.icon} class="size-5 shrink-0 sm:size-6" />
				<span class="hidden max-w-full truncate sm:block">{item.label()}</span>
			</a>
		{/each}

		<div class="relative min-h-11 min-w-0 flex-1 self-stretch sm:min-h-12" data-nav-dropdown>
			<button
				type="button"
				class="{mobileTabBaseClass} {isSecondaryActive(page.url.pathname)
					? mobileActiveClass
					: mobileIdleClass} absolute inset-0"
				aria-expanded={mobileMoreOpen}
				aria-haspopup="menu"
				aria-label={m.nav_more()}
				title={m.nav_more()}
				onclick={toggleMobileMore}
			>
				<NavIcon name="more" class="size-5 shrink-0 sm:size-6" />
				<span class="hidden max-w-full truncate sm:block">{m.nav_more()}</span>
			</button>

			{#if mobileMoreOpen}
				<div
					class="absolute end-0 bottom-full z-10 mb-2 min-w-44 rounded-xl border border-border bg-card p-1 shadow-lg"
					role="menu"
				>
					{#each secondaryNav as item (item.href)}
						{@const active = isActive(item.href, page.url.pathname)}
						<a
							href={resolve(item.href)}
							class="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm transition {active
								? 'bg-accent-muted font-medium text-accent-text'
								: 'text-muted hover:bg-accent-muted/60 hover:text-accent-text'}"
							aria-current={active ? 'page' : undefined}
							onclick={closeMenus}
						>
							<NavIcon name={item.icon} class="size-4 shrink-0" />
							{item.label()}
						</a>
					{/each}
					{#if isAdmin}
						{@const active = isActive(adminNav.href, page.url.pathname)}
						<a
							href={resolve(adminNav.href)}
							class="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm transition {active
								? 'bg-warning-bg font-medium text-admin'
								: 'text-admin hover:bg-warning-bg'}"
							aria-current={active ? 'page' : undefined}
							onclick={closeMenus}
						>
							<NavIcon name={adminNav.icon} class="size-4 shrink-0" />
							{adminNav.label()}
						</a>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</nav>
