<script lang="ts">
	import PostForm from '$lib/components/form/post/PostForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const tags = data.tags;
</script>

<div>
	<PostForm {tags} id={data.id} post={data.post} />
</div>
