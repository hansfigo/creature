<script lang="ts">
	import { enhance } from '$app/forms';
	import Container from '$lib/components/shared/container.svelte';
	import { ICON } from '$lib/consants';
	import { animationStore, currentAnimationStore } from '$lib/state';
	import Icon from '@iconify/svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';
	import App from './components/App.svelte';

	export let data: PageData;

	const { user } = data;

	let posts = data.posts;
	let isFollowLoading = false;
	let isCommentLoading = false;
	let isBookmarkLoading = false;

	const dataUser = writable(data.posts.user);

	let isFollowing = data.posts.user.isFollowing;
	const userId = data.posts.user.id;

	// make post reactive to changes
	$: {
		posts = data.posts;
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

	let colorValue: any = '#0e0231';
</script>

<Container>
	{#if posts}
		<div class="h-full relative">
			<div
				bind:this={canvas}
				style={`background-color: ${colorValue} !important;`}
				class={`relative w-full bg-main bg-slate-800 h-[38%] md:h-[55%] border-2 border-slate-800 rounded-3xl`}
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

				<button
					on:click={toggleFullScreen}
					class="btn absolute bottom-4 right-1 md:right-5 text-2xl"
				>
					{#if isFullScreen}
						<Icon icon="ic:baseline-fullscreen-exit" />
					{:else}
						<Icon icon="ic:baseline-fullscreen" />
					{/if}
				</button>

				<div class="flex items-center gap-2 absolute top-4 right-1 md:right-5 rounded-lg">
					<label for="bg" class="text-2xl btn">🎨</label>
					<input
						name="bg"
						id="bg"
						class="input opacity-0 w-0 max-w-0"
						type="color"
						bind:value={colorValue}
					/>
				</div>

				{#if posts.modelPath}
					<App modelFile={posts.modelPath} />
				{/if}
			</div>

			<div class="mt-4">
				<div class="flex w-full items-center justify-between gap-4">
					<h1 class="text-2xl font-black break-words">{posts.title}</h1>
					<div class="flex gap-2">
						<form
							action="?/like"
							method="post"
							use:enhance={() => {
								likeLoading = true;
								return async ({ update }) => {
									await update({
										reset: false
									});
									likeLoading = false;
								};
							}}
						>
							<button
								type="submit"
								disabled={likeLoading}
								class={`btn button-lg ${posts.isLiked ? 'variant-filled-secondary' : 'variant-outline-secondary'} `}
							>
								<span class="hidden md:block">
									{posts.isLiked ? 'Liked' : 'Like'}
								</span>
								{#if likeLoading}
									<ProgressRadial class="ml-2 w-4" />
								{:else}
									<Icon class="ml-2" icon="ic:baseline-thumb-up" />
								{/if}
							</button>
							<input class="input hidden" type="text" name="userId" id="userId" value={userId} />
							<input class="input hidden" type="text" name="liked" value={posts.isLiked} />
						</form>
						<form
							use:enhance={() => {
								isBookmarkLoading = true;
								return async ({ update }) => {
									await update({
										reset: false
									});
									isBookmarkLoading = false;
								};
							}}
							action="?/bookmark"
							method="post"
						>
							<button
								disabled={isBookmarkLoading}
								class={`btn  ${posts.isBookmarked ? 'variant-filled-secondary' : 'variant-outline-secondary'}`}
							>
								<Icon class="md:text-2xl" icon="ic:baseline-bookmark" />
								{#if isBookmarkLoading}
									<ProgressRadial class="ml-2 w-4" />
								{/if}
							</button>
							<input
								class="input hidden"
								type="text"
								name="bookmarked"
								value={posts.isBookmarked}
							/>
						</form>
						<button class="btn variant-outline-secondary">
							<svg
								class="w-4 h-4 md:w-5 md:h-5 dark:text-white"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								width="12"
								height="24"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									fill-rule="evenodd"
									d="M14.516 6.743c-.41-.368-.443-1-.077-1.41a.99.99 0 0 1 1.405-.078l5.487 4.948.007.006A2.047 2.047 0 0 1 22 11.721a2.06 2.06 0 0 1-.662 1.51l-5.584 5.09a.99.99 0 0 1-1.404-.07 1.003 1.003 0 0 1 .068-1.412l5.578-5.082a.05.05 0 0 0 .015-.036.051.051 0 0 0-.015-.036l-5.48-4.942Zm-6.543 9.199v-.42a4.168 4.168 0 0 0-2.715 2.415c-.154.382-.44.695-.806.88a1.683 1.683 0 0 1-2.167-.571 1.705 1.705 0 0 1-.279-1.092V15.88c0-3.77 2.526-7.039 5.967-7.573V7.57a1.957 1.957 0 0 1 .993-1.838 1.931 1.931 0 0 1 2.153.184l5.08 4.248a.646.646 0 0 1 .012.011l.011.01a2.098 2.098 0 0 1 .703 1.57 2.108 2.108 0 0 1-.726 1.59l-5.08 4.25a1.933 1.933 0 0 1-2.929-.614 1.957 1.957 0 0 1-.217-1.04Z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
					</div>
				</div>

				<div class="mt-8">
					<div class="flex gap-3 h-full items-center">
						<div
							class="md:h-20 md:w-20 w-14 h-14 rounded-full flex flex-col overflow-hidden items-center justify-center"
						>
							{#if !posts.user.profilePicture}
								<div class="w-24 h-24 rounded-full bg-slate-900"></div>
							{:else}
								<img class="w-full h-full object-cover" src={posts.user.profilePicture} alt="" />
							{/if}
						</div>
						<div>
							<a class="text-base font-bold hover:underline" href={`/u/${$dataUser?.username}`}
								>{$dataUser?.username}</a
							>
							<p class="text-sm font-normal">{posts.user.followersCount} Followers</p>
						</div>
					</div>
				</div>

				{#if user?.id != posts.user.id}
					<div class="mt-6 mb-8 flex gap-2">
						<form
							action="?/follow"
							method="post"
							use:enhance={() => {
								isFollowLoading = true;
								return async ({ update }) => {
									await update({ reset: false });
									isFollowLoading = false;
								};
							}}
						>
							<button
								disabled={isFollowLoading}
								type="submit"
								class="btn text-xs btn-sm md:btn-base variant-filled-secondary"
							>
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
						<a href={`mailto:${posts.user.email}`}>
							<button class="btn text-xs btn-sm md:btn-base variant-filled-secondary"
								>Contact
								<Icon icon={ICON['ARROW-OUTWARD']} />
							</button>
						</a>
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

				<dir class="h-[0.1px] w-full my-5 bg-white"> </dir>

				<div>
					<p class="text-lg font-bold mb-3">Descripton</p>
					<p>{posts.description ? posts.description : '-'}</p>
				</div>

				<div class="mt-4">
					<p class="text-lg font-bold mb-3">Tags</p>
					<div class="flex flex-wrap gap-1">
						{#each tags as tag}
							<a href={`/search?tags=${tag.tag}`}>
								<button class=" btn bg-blue-primary text-white px-2 py-1 rounded-full"
									>{tag.tag}</button
								>
							</a>
						{/each}
					</div>
				</div>

				<form
					method="post"
					action="?/comment"
					use:enhance={() => {
						isCommentLoading = true;
						return async ({ update }) => {
							await update({
								reset: false
							});
							isCommentLoading = false;
						};
					}}
					class="mt-4"
				>
					<p class="text-lg font-bold mb-3">Comments</p>
					<div class="input-group input-group-divider grid-cols-[1fr_auto]">
						<input
							disabled={isCommentLoading}
							name="comment"
							type="text"
							placeholder="Write your comments !!"
						/>

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
									<a class="hover:underline" href={`/u/${comment.user.username}`}>@{comment.user.username}</a>
									<p>{comment.content}</p>
								</div>
							</div>
						{/each}
					</div>

					<input
						class="input"
						type="hidden"
						name="userIdFromComment"
						id="userIdFromComment"
						value={userId}
					/>
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
