<script lang="ts">
	import AppHeader from '$lib/components/AppHeader.svelte';

	let { children, data } = $props();
</script>

<div class="min-h-screen bg-background text-foreground">
	<AppHeader isAdmin={data.isAdmin} username={data.user?.username} />

	<main class="safe-area-padding-x mx-auto max-w-6xl pt-6 pb-mobile-nav lg:py-6">
		{@render children()}
	</main>
</div>
