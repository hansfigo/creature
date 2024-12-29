<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status}: {$page.error?.message}</title>
</svelte:head>

<div class="flex min-w-full min-h-full justify-center items-center">
	<div class="container w-full h-full flex flex-col justify-center">
		<h1 class="text-center text-4xl font-bold">{$page.status}: {$page.error?.message}</h1>
		{#if $page.status === 404}
			<div class="text-center">
				<a href="/">
					<button class="btn variant-filled-secondary mt-4">Back to Home</button>
				</a>
			</div>
		{/if}

		{#if $page.status === 500}
			<div class="text-center">
				<button class="btn variant-filled-secondary mt-4" on:click={() => location.reload()}
					>Reload</button
				>
			</div>
			<div class="text-center">
				<a href="/">
					<button class="btn variant-outline-secondary mt-4">Back to Home</button>
				</a>
			</div>
		{/if}
	</div>
</div>
