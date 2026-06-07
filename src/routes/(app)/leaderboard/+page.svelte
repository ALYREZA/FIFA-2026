<script lang="ts">
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	function profileHref(username: string) {
		return resolve('/u/[username]', { username });
	}
</script>

<div class="space-y-6">
	<div>
		<h1 class="page-title">{m.leaderboard_title()}</h1>
		<p class="page-desc">{m.leaderboard_intro()}</p>
	</div>

	{#if data.leaderboard.length === 0}
		<p class="card p-8 text-center text-subtle">{m.leaderboard_empty()}</p>
	{:else}
		<div class="card overflow-hidden">
			<table class="w-full text-start text-sm">
				<thead class="bg-card text-muted">
					<tr>
						<th class="px-4 py-3">{m.leaderboard_rank()}</th>
						<th class="px-4 py-3">{m.leaderboard_player()}</th>
						<th class="px-4 py-3">{m.leaderboard_points()}</th>
						<th class="hidden px-4 py-3 sm:table-cell">{m.leaderboard_exact()}</th>
						<th class="hidden px-4 py-3 sm:table-cell">{m.leaderboard_correct()}</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border bg-card-muted">
					{#each data.leaderboard as entry, i (entry.userId)}
						<tr class="hover:bg-card-muted">
							<td class="px-4 py-3 text-subtle">{i + 1}</td>
							<td class="px-4 py-3 font-medium text-foreground">
								{#if entry.username}
									<a href={profileHref(entry.username)} class="link">
										@{entry.username}
									</a>
								{:else}
									{m.leaderboard_anonymous()}
								{/if}
							</td>
							<td class="px-4 py-3 font-semibold text-accent-text">{entry.totalPoints}</td>
							<td class="hidden px-4 py-3 text-muted sm:table-cell">{entry.exactScores}</td>
							<td class="hidden px-4 py-3 text-muted sm:table-cell">{entry.correctResults}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
