<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<h1 class="text-4xl">Users</h1>
<div class="table-container">
	<!-- Native Table Element -->
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Email</th>
				<th>Username</th>
				<th>Plan</th>
			</tr>
		</thead>
		<tbody>
			{#each data.user as row, i}
				<tr>
					<td>{row.email}</td>
					<td>{row.username}</td>
					<td>{row.active_plan}</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<th colspan="3">Total User</th>
				<td>{data.user.length}</td>
			</tr>
		</tfoot>
	</table>
</div>
