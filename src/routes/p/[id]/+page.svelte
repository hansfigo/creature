<script lang="ts">
	import { animationStore, currentAnimationStore } from '$lib/state';
	import App from './components/App.svelte';
	import type { PageData } from './$types';
	import Container from '$lib/components/shared/container.svelte';
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	export let data: PageData;

	const calculateAge = (createdAt: Date) => {
		const now = new Date();
		const createdDate = new Date(createdAt);

		const diffInMilliseconds = now.getTime() - createdDate.getTime();

		const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
		const diffInMinutes = Math.floor(diffInSeconds / 60);
		const diffInHours = Math.floor(diffInMinutes / 60);
		const diffInDays = Math.floor(diffInHours / 24);

		if (diffInDays > 0) {
			return `${diffInDays} days`;
		} else if (diffInHours > 0) {
			return `${diffInHours} hours`;
		} else if (diffInMinutes > 0) {
			return `${diffInMinutes} minutes`;
		} else {
			return `${diffInSeconds} seconds`;
		}
	};

	let likeLoading = false;
</script>

<Container>
	{#if data}
		<div class="h-full relative">
			<div class="relative w-full h-[55%] border-2 border-slate-800 rounded-3xl">
				<div class="absolute z-40 bottom-0 right-[50%]">
					{#if $animationStore}
						{#each $animationStore as animation}
							<button
								on:click={() => currentAnimationStore.set(animation[0])}
								class="btn variant-filled-secondary">{animation[0]}</button
							>
						{/each}
					{/if}
				</div>

				{#if data.modelPath}
					<App modelFile={data.modelPath} />
				{/if}
			</div>
			<div class="mt-4">
				<div class="flex w-full justify-between">
					<h1 class="text-3xl font-black">{data.title}</h1>
					<div class="flex gap-4">
						<form
							action="?/like"
							method="post"
							use:enhance={() => {
								likeLoading = true;
								return async ({ update }) => {
									likeLoading = false;
									update();
								};
							}}
						>
							<button
								disabled={likeLoading}
								class={`btn ${data.isLiked ? 'variant-filled-secondary' : 'variant-outline-secondary'} `}
							>
								{data.isLiked ? 'Liked' : 'Like'}
								{#if likeLoading}
									<ProgressRadial class="ml-2 w-4" />
								{:else}
									<Icon class="ml-2" icon="ic:baseline-thumb-up" />
								{/if}
							</button>
							<input class="input hidden" type="text" name="liked" value={data.isLiked} />
						</form>
						<button class="btn variant-outline-secondary"
							>Share
							<Icon class="ml-2" icon="ic:baseline-share" />
						</button>
					</div>
				</div>

				<div class="mt-8">
					<div class="flex gap-3 h-full items-center">
						<div
							class="h-20 w-20 rounded-full flex flex-col overflow-hidden items-center justify-center"
						>
							{#if !data.user.profilePicture}
								<div class="w-24 h-24 rounded-full bg-slate-900"></div>
							{:else}
								<img class="w-full h-full object-cover" src={data.user.profilePicture} alt="" />
							{/if}
						</div>
						<div>
							<p class="text-xl font-bold">{data.user.username}</p>
						</div>
					</div>
				</div>

				{#if data.createdAt}
					<div class="flex w-full justify-between">
						<p class="mt-4">{`Published ${calculateAge(data.createdAt)} Ago`}</p>
						<div class="flex items-center gap-2">
							<Icon class="ml-2" icon="ic:baseline-thumb-up" />
							<p>{data.likes}</p>
						</div>
					</div>
				{/if}

				<br />
				<dir class="h-[0.1px] w-full bg-white"> </dir>

				<br />

				<div>
					<p class="text-lg font-bold mb-3">Descripton</p>
					<p>{data.description}</p>
				</div>

				<form method="post" action="?/comment" use:enhance class="mt-4">
					<p class="text-lg font-bold mb-3">Comments</p>
					<input
						placeholder="Write your comments !!"
						class="input"
						type="text"
						name="comment"
						id=""
					/>

					<div class="grid md:grid-cols-2 gap-4 mt-4">
						{#each data.comments as comment}
							<div class="flex w-full gap-4">
								<div class="bg-slate-700 h-16 w-20 rounded-full overflow-hidden">
									{#if comment.user.profilePicture}
										<img
											class="w-full h-full object-cover"
											src={comment.user.profilePicture}
											alt=""
										/>
									{/if}
								</div>
								<div class="px-8 py-4 rounded-3xl bg-blue-primary w-full">
									<p>@{comment.user.username}</p>
									<p>{comment.content}</p>
								</div>
							</div>
						{/each}
					</div>
				</form>
			</div>
		</div>
	{/if}
</Container>
