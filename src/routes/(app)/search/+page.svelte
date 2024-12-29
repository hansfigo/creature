<script lang="ts">
	import { enhance } from '$app/forms';
	import Container from '$lib/components/shared/container.svelte';
	import Postcard from '$lib/components/shared/post/postcard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let posts = data.posts;

	$: posts = data.posts;
</script>

<Container>
	<form use:enhance class="mb-4 block md:hidden">
		<input class="input" type="text" name="query" id="query" placeholder="Search Models..." />
	</form>

	{#if data.query || data.tags}
		<div class="flex justify-between items-center mb-4">
			{#if data.query}
				<h1 class="md:text-2xl font-light mb-4">
					{`Search for : `} <span class="font-black">{data.query}</span>
				</h1>
			{/if}

			{#if data.tags}
				<h1 class="md:text-2xl font-light mb-4">
					{`Search for Tag : `} <span class="font-black">{data.tags}</span>
				</h1>
			{/if}

			<a href="search/" class="underline text-secondary-300">Reset</a>
		</div>
	{/if}

	<div class="flex flex-wrap gap-2 mb-3">
		{#if data.tagList !== undefined}
			{#each data.tagList as tag}
				<a href={`/search?tags=${tag.name}`}>
					<button class=" btn btn-sm md:btn-base bg-blue-primary text-white px-2 py-1 rounded-full"
						>{tag.name}</button
					>
				</a>
			{/each}
		{/if}
	</div>

	{#if posts && posts.length === 0}
		<p class="mt-10">No posts found, try with another key words</p>
	{:else}
		<div class="flex flex-wrap mt-10 gap-4">
			{#if posts !== undefined}
				{#each posts as post}
					<Postcard {post} />
				{/each}
			{/if}
		</div>
	{/if}
</Container>
