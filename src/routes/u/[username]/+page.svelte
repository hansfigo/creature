<script lang="ts">
	import { goto } from '$app/navigation';
	import Container from '$lib/components/shared/container.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const { userDetail, user } = data;

	const firstName = userDetail?.firstName;
	const lastName = userDetail?.lastName;

	console.log(data);
</script>

<svelte:head>
	<title>{`${firstName} ${lastName}`}</title>
</svelte:head>

<Container>
	<div class="flex flex-col gap-12 min-h-[20rem]">
		<div>
			<p class="font-bold text-4xl mb-4">
				{`${firstName} ${lastName}`}
			</p>
			{#if user && user.id === userDetail.id}
			<div class="flex gap-4">
				<a href="/dashboard/upload" class="btn variant-outline-secondary">Create Post + </a>
				<button on:click={()=> goto('/signout')} class="btn variant-filled-error">
					<span>Logout</span>
				</button>
			</div>
			{/if}
		</div>

		<div>
			<p class="font-bold text-3xl mb-4">Your Posts</p>
			<div class="flex gap-4">
				<div class="flex flex-col gap-2">
					<p class="font-bold text-xl">Post Title</p>
					<p class="text-sm">Post Content</p>
				</div>
				<div class="flex flex-col gap-2">
					<p class="font-bold text-xl">Post Title</p>
					<p class="text-sm">Post Content</p>
				</div>
				<div class="flex flex-col gap-2">
					<p class="font-bold text-xl">Post Title</p>
					<p class="text-sm">Post Content</p>
				</div>
			</div>
		</div>
	</div>
</Container>
