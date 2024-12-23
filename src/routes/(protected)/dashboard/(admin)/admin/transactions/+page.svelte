<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>


<h1 class="text-4xl">Transactions</h1>
<div class="table-container">
	<!-- Native Table Element -->
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Created At</th>
				<th>Amount</th>
				<th>Status</th>
			</tr>
		</thead>
		<tbody>
			{#each data.transactions as row, i}
				<tr>
					<td>{row.created_at}</td>
					<td>{row.amount}</td>
					<td>{row.status}</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<th colspan="2">Total Transactions</th>
				<td>{data.transactions.length}</td>
			</tr>
		</tfoot>
	</table>
</div>
