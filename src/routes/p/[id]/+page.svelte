<script lang="ts">
	import { animationStore, currentAnimationStore } from '$lib/state';
	import App from './components/App.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="h-screen relative">
	<div class="absolute z-40 bottom-0 right-[50%]">
		{#if $animationStore}
			{#each $animationStore as animation}
				<button
					on:click={() => currentAnimationStore.set(animation[0])}
					class="btn variant-filled-primary">{animation[0]}</button
				>
			{/each}
		{/if}
	</div>

	{#if data.model}
		<App modelFile={data.model} />
	{/if}
</div>
