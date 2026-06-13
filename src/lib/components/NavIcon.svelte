<script lang="ts">
	export type NavIconName =
		| 'home'
		| 'predict'
		| 'standings'
		| 'bracket'
		| 'leaderboard'
		| 'extras'
		| 'podium'
		| 'rules'
		| 'admin'
		| 'more'
		| 'user';

	let { name, class: className = '' }: { name: NavIconName; class?: string } = $props();
</script>

<svg
	class={className}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.75"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{#if name === 'home'}
		<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-7H10v7H5a1 1 0 0 1-1-1v-9.5Z" />
	{:else if name === 'predict'}
		<circle cx="12" cy="12" r="9" />
		<path d="M12 3c2.5 2.8 4 6.2 4 9s-1.5 6.2-4 9M12 3C9.5 5.8 8 9.2 8 12s1.5 6.2 4 9M3 12h18" />
	{:else if name === 'standings'}
		<path d="M4 19V5M4 19h16M8 19V9M12 19V13M16 19V7" />
	{:else if name === 'bracket'}
		<path
			d="M6 6h4v4H8a2 2 0 0 0-2 2v2H6V6ZM14 6h4v6h-2a2 2 0 0 0-2 2v5h-4v-4h2a2 2 0 0 0 2-2V6Z"
		/>
	{:else if name === 'leaderboard'}
		<path d="M8 21V10M12 21V6M16 21V14M6 10h12L12 3 6 10Z" />
	{:else if name === 'extras'}
		<path d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8.2l5-.7L12 3Z" />
	{:else if name === 'podium'}
		<path d="M8 21V11H4v10M12 21V7h4v14M20 21V15h-4v6" />
	{:else if name === 'rules'}
		<path d="M6 4h9a3 3 0 0 1 3 3v13H9a3 3 0 0 1-3-3V4ZM6 4v13a3 3 0 0 0 3 3" />
		<path d="M9 8h6M9 12h6" />
	{:else if name === 'admin'}
		<circle cx="12" cy="12" r="3" />
		<path
			d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
		/>
	{:else if name === 'more'}
		<circle cx="6" cy="12" r="1.25" fill="currentColor" stroke="none" />
		<circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
		<circle cx="18" cy="12" r="1.25" fill="currentColor" stroke="none" />
	{:else if name === 'user'}
		<circle cx="12" cy="8" r="3.5" />
		<path d="M5 20a7 7 0 0 1 14 0" />
	{/if}
</svg>
