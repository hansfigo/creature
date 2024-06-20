<script lang="ts">
	import { goto } from '$app/navigation';
	import Navbar from '$lib/components/shared/navbar.svelte';
	import Postcard from '$lib/components/shared/post/postcard.svelte';
	import { removeGlbExtension } from '$lib/utils.js';

	export let data;

	const posts = data.postList;

	// const models = data.models.map((model: string) => removeGlbExtension(model));
</script>

<main class="flex justify-center h-screen w-screen gap-4 overflow-hidden px-8">
	<div class="container">
		<section class="flex flex-col gap-4">
			<h1 class="text-3xl font-bold">Latest Upload</h1>
			<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
				{#each posts as post}
					<Postcard {post} />
				{/each}
			</div>
		</section>
	</div>
</main>
