<script lang="ts">
	import { animationStore, currentAnimationStore } from '$lib/state';
	import App from './components/App.svelte';
	import type { PageData } from './$types';
	import Container from '$lib/components/shared/container.svelte';
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { ICON } from '$lib/consants';
	import { writable } from 'svelte/store';
	import { is } from 'drizzle-orm';

	export let data: PageData;

	const { user } = data;

	let posts = data.posts;
	let isFollowLoading = false;
	let isCommentLoading = false;

	const dataUser = writable(data.posts.user);

	let isFollowing = data.posts.user.isFollowing;
	const userId = data.posts.user.id;
	// make post reactive to changes
	$: {
		posts = data.posts;
		console.log(userId);
		isFollowing = data.posts.user.isFollowing;
	}
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

	let canvas: HTMLElement;

	let isFullScreen = false;

	const toggleFullScreen = () => {
		if (!document.fullscreenElement) {
			canvas.requestFullscreen();
			isFullScreen = true;
		} else {
			document.exitFullscreen();
			isFullScreen = false;
		}
	};

	//Tags list
	const tags = posts.tags;
</script>

<Container>
	{#if posts}
		<div class="h-full relative">
			<div
				bind:this={canvas}
				class="relative w-full bg-main bg-slate-800 h-[55%] border-2 border-slate-800 rounded-3xl"
			>
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

				<button on:click={toggleFullScreen} class="btn absolute bottom-4 right-5 text-2xl">
					{#if isFullScreen}
						<Icon icon="ic:baseline-fullscreen-exit" />
					{:else}
						<Icon icon="ic:baseline-fullscreen" />
					{/if}
				</button>

				{#if posts.modelPath}
					<App modelFile={posts.modelPath} />
				{/if}
			</div>
			<div class="mt-4">
				<div class="flex w-full justify-between">
					<h1 class="text-3xl font-black">{posts.title}</h1>
					<div class="flex gap-4">
						<form
							action="?/like"
							method="post"
							use:enhance={() => {
								likeLoading = true;
								return async ({ update }) => {
									update();
									likeLoading = false;
								};
							}}
						>
							<button
								disabled={likeLoading}
								class={`btn ${posts.isLiked ? 'variant-filled-secondary' : 'variant-outline-secondary'} `}
							>
								{posts.isLiked ? 'Liked' : 'Like'}
								{#if likeLoading}
									<ProgressRadial class="ml-2 w-4" />
								{:else}
									<Icon class="ml-2" icon="ic:baseline-thumb-up" />
								{/if}
							</button>
							<input class="input hidden" type="text" name="liked" value={posts.isLiked} />
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
							{#if !posts.user.profilePicture}
								<div class="w-24 h-24 rounded-full bg-slate-900"></div>
							{:else}
								<img class="w-full h-full object-cover" src={posts.user.profilePicture} alt="" />
							{/if}
						</div>
						<div>
							<p class="text-xl font-bold">{$dataUser?.username}</p>
							<p class="text-base font-normal">{$dataUser?.followersCount} Followers</p>
						</div>
					</div>
				</div>

				{#if user?.id != posts.user.id}
					<div class="mt-6 flex gap-4">
						<form
							action="?/follow"
							method="post"
							use:enhance={() => {
								isFollowLoading = true;
								return async ({ update }) => {
									update({ reset: false });
									isFollowLoading = false;
								};
							}}
						>
							<button disabled={isFollowLoading} type="submit" class="btn variant-filled-secondary">
								<span>{isFollowing ? 'Followed ' : 'Follow +'}</span>
								{#if isFollowLoading}
									<ProgressRadial class="ml-2 w-4" />
								{/if}
							</button>
							<input
								class="input hidden"
								type="text"
								name="followed"
								id="followed"
								bind:value={isFollowing}
							/>
							<input class="input hidden" type="text" name="userId" id="userId" value={userId} />
						</form>
						<button class="btn variant-filled-secondary"
							>Contact
							<Icon icon={ICON['ARROW-OUTWARD']} />
						</button>
					</div>
				{/if}

				{#if posts.createdAt}
					<div class="flex w-full justify-between mt-4">
						<p>{`Published  ${calculateAge(posts.createdAt)} ago`}</p>

						<div class="flex gap-4 items-center">
							<div class="flex items-center text-lg gap-2">
								<Icon class="ml-2" icon={ICON.EYE} />
								<p>{posts.views}</p>
							</div>
							<div class="flex items-center text-lg gap-2">
								<Icon class="ml-2" icon="ic:baseline-thumb-up" />
								<p>{posts.likes}</p>
							</div>
							<div class="flex items-center text-lg gap-2">
								<Icon class="ml-2" icon={ICON.ALERT_REPORT} />
							</div>
						</div>
					</div>
				{/if}

				<dir class="h-[0.1px] w-full bg-white"> </dir>

				<div>
					<p class="text-lg font-bold mb-3">Descripton</p>
					<p>{posts.description ? posts.description : '-'}</p>
				</div>

				<div class="mt-4">
					<p class="text-lg font-bold mb-3">Tags</p>
					<div class="flex flex-wrap gap-1">
						{#each tags as tag}
							<span class="bg-blue-primary text-white px-2 py-1 rounded-full">{tag.tag}</span>
						{/each}
					</div>
				</div>

				<form
					method="post"
					action="?/comment"
					use:enhance={() => {
						isCommentLoading = true;
						return async ({ update }) => {
							update();
							isCommentLoading = false;
						};
					}}
					class="mt-4"
				>
					<p class="text-lg font-bold mb-3">Comments</p>
					<div class="input-group input-group-divider grid-cols-[1fr_auto]">
						<input disabled={isCommentLoading} name="comment" type="text" placeholder="Write your comments !!" />
						{#if isCommentLoading}
						<div>
							<ProgressRadial class="w-4" />
						</div>
						{/if}
					</div>

					<div class="grid md:grid-cols-2 gap-4 mt-4">
						{#each posts.comments as comment}
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

<style>
	.bg-main {
		background: rgba(14, 2, 49, 1);
	}
</style>
