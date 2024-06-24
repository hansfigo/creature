<script lang="ts">
	import { animationStore, currentAnimationStore } from '$lib/state';
	import App from './components/App.svelte';
	import type { PageData } from './$types';
	import Container from '$lib/components/shared/container.svelte';
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { ICON } from '$lib/consants';

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
	const tags = [
		'3D',
		'Model',
		'Design',
		'Art',
		'Animation',
		'3D Model',
		'3D Design',
		'3D Art',
		'3D Animation',
		'3D Model Design',
		'3D Model Art',
		'3D Model Animation',
		'3D Design Art',
		'3D Design Animation',
		'3D Art Animation',
		'3D Model Design Art',
		'3D Model Design Animation',
		'3D Model Art Animation',
		'3D Design Art Animation',
		'3D Model Design Art Animation'
	];

	//pick random number 1-5
	const random = Math.floor(Math.random() * 5) + 1;

	//pick random tags based on random number
	const randomTags = tags.slice(0, random);
</script>

<Container>
	{#if data}
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

				<div class="my-6 flex gap-4">
					<button class="btn variant-filled-secondary">Follow +</button>
					<button class="btn variant-filled-secondary"
						>Contact
						<Icon icon={ICON['ARROW-OUTWARD']} />
					</button>
				</div>

				{#if data.createdAt}
					<div class="flex w-full justify-between">
						<p>{`Published  ${calculateAge(data.createdAt)} ago`}</p>

						<div class="flex gap-4 items-center">
							<div class="flex items-center text-lg gap-2">
								<Icon class="ml-2" icon={ICON.EYE} />
								<p>{data.likes + Math.floor(Math.random() * (500 - 20 + 1)) + 20}</p>
							</div>
							<div class="flex items-center text-lg gap-2">
								<Icon class="ml-2" icon="ic:baseline-thumb-up" />
								<p>{data.likes}</p>
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
					<p>{data.description ? data.description : '-'}</p>
				</div>

				<div class="mt-4">
					<p class="text-lg font-bold mb-3">Tags</p>
					<div class="flex flex-wrap gap-1">
						{#each randomTags as tag}
							<span class="bg-blue-primary text-white px-2 py-1 rounded-full">{tag}</span>
						{/each}
					</div>
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

<style>
	.bg-main {
		background: rgba(14, 2, 49, 1);
	}
</style>
