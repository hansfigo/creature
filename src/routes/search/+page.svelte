<script lang="ts">
	import Container from '$lib/components/shared/container.svelte';
	import Postcard from '$lib/components/shared/post/postcard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Container>
	{#if data.query}
		<h1 class="text-2xl font-light">
			{`Search for : `} <span class="font-black">{data.query}</span>
		</h1>
	{/if}

	{#if data.tags}
		<h1 class="text-2xl font-light">
			{`Search for Tag : `} <span class="font-black">{data.tags}</span>
		</h1>
	{/if}

	{#if data.posts && data.posts.length === 0}
		<p class="mt-10">No posts found, try with another key words</p>
	{:else}
		<div class="flex flex-wrap mt-10">
			{#if data.posts}
				{#each data.posts as post}
					<Postcard {post} />
				{/each}
			{/if}
		</div>
	{/if}
</Container>
