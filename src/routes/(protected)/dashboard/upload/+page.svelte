<script lang="ts">
	import PostForm from '$lib/components/form/post/PostForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const tags = data.tags;
	const user = data.user;
</script>

<div>
	<PostForm {tags} {user} />
</div>
