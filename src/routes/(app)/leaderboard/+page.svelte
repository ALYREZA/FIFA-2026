<script lang="ts">
	let { data } = $props();
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-white">Leaderboard</h1>
		<p class="mt-1 text-sm text-slate-400">
			Ranked by total points, then exact scores, then earliest submission.
		</p>
	</div>

	{#if data.leaderboard.length === 0}
		<p class="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-500">
			No scores yet. Make predictions to appear on the board!
		</p>
	{:else}
		<div class="overflow-hidden rounded-xl border border-slate-800">
			<table class="w-full text-left text-sm">
				<thead class="bg-slate-900 text-slate-400">
					<tr>
						<th class="px-4 py-3">#</th>
						<th class="px-4 py-3">Player</th>
						<th class="px-4 py-3">Points</th>
						<th class="px-4 py-3 hidden sm:table-cell">Exact</th>
						<th class="px-4 py-3 hidden sm:table-cell">Correct</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-800 bg-slate-900/50">
					{#each data.leaderboard as entry, i (entry.userId)}
						<tr class="hover:bg-slate-800/50">
							<td class="px-4 py-3 text-slate-500">{i + 1}</td>
							<td class="px-4 py-3 font-medium text-white">{entry.name}</td>
							<td class="px-4 py-3 font-semibold text-emerald-400">{entry.totalPoints}</td>
							<td class="px-4 py-3 hidden text-slate-400 sm:table-cell">{entry.exactScores}</td>
							<td class="px-4 py-3 hidden text-slate-400 sm:table-cell">{entry.correctResults}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
