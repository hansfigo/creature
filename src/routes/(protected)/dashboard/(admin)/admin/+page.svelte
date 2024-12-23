<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1 class="text-4xl">Dashboard</h1>
<div class="flex gap-2">
	<div class="card w-56 h-28 px-4 py-2 variant-outline-secondary">
		<h3>Total Post</h3>
		<h1 class="text-4xl font-bold">{data.totalPost}</h1>
	</div>
	<div class="card w-56 h-28 px-4 py-2 variant-outline-secondary">
		<h3>Total User</h3>
		<h1 class="text-4xl font-bold">{data.totalUser}</h1>
	</div>
</div>
