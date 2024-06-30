<script lang="ts">
	import Container from '$lib/components/shared/container.svelte';
	import Postcard from '$lib/components/shared/post/postcard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const bookmarksParser = (bookmarks: any) => {
		return bookmarks.map((bookmark: any) => {
			return {
				id: bookmark.post.id,
				title: bookmark.post.title,
				thumbnail: bookmark.post.thumbnail,
				views : bookmark.post.views,
				likes : bookmark.post.likes,
				user: {
					username: bookmark.user.username
				}
			};
		});
	};
</script>

<Container>
	<h1 class="font-bold text-4xl mb-4">Bookmarks</h1>
	{#if data.bookmarks.length === 0}
		<p>No bookmarks yet.</p>
	{:else}
		<div class="flex flex-wrap">
			{#each bookmarksParser(data.bookmarks) as bookmark}
				<Postcard post={bookmark} />
			{/each}
		</div>
	{/if}
</Container>
