<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="flex w-full justify-center items-center flex-col">
	<h1 class="text-4xl">Thanks</h1>
	<p class="text-xl">Your payment has been processed successfully</p>
</div>
