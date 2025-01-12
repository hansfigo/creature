<script lang="ts">
	import { goto } from '$app/navigation';
	import Container from '$lib/components/shared/container.svelte';
	import Postcard from '$lib/components/shared/post/postcard.svelte';
	import { ICON, LOGO } from '$lib/consants';
	import { useFirebase } from '$lib/firebase';
	import { isLoadingStore } from '$lib/state';
	import Icon from '@iconify/svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;
	const modalStore = getModalStore();

	const image = writable<HTMLInputElement | null>(null);
	const imageUrl = writable<string | null>(null);
	let isLoading = false;

	$: {
		if (data.user && data.user.profilePicture) {
			imageUrl.set(data.user.profilePicture);
		}
	}

	const { posts, user, locals } = data;

	// const handleImage = (e: Event) => {
	// 	const target = e.target as HTMLInputElement;
	// 	const file = target.files?.[0] as File;
	// 	if (file) {
	// 		const reader = new FileReader();
	// 		reader.onload = (e) => {
	// 			imageUrl.set(e.target?.result as string);

	// 			const modalComponent: ModalComponent = {
	// 				ref: ImageCropper,
	// 				props: {
	// 					image: e.target?.result as string,
	// 					onCropComplete: (e: any) => {},
	// 					classList: 'w-[20rem] h-[20rem] bg-black relative z-[99]'
	// 				}
	// 			};

	// 			const modal: ModalSettings = {
	// 				type: 'component',
	// 				component: modalComponent
	// 			};

	// 			modalStore.trigger(modal);
	// 		};
	// 		reader.readAsDataURL(file);
	// 	}
	// };

	const handleImageSimple = async (e: Event) => {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0] as File;

		if (file) {
			imageUrl.set(URL.createObjectURL(file));

			isLoading = true;

			isLoadingStore.set(true);

			const profilePicture = await useFirebase.uploadFile({
				file: file,
				path: '/users/profilePictures/'
			});

			if (!profilePicture) {
				alert('Error uploading image');
			}

			const formData = new FormData();
			formData.append('profilePicture', profilePicture);

			const res = await fetch(`/api/user/${user?.username}`, {
				method: 'PUT',
				body: formData
			});

			if (res.ok) {
				const data = await res.json();
			} else {
				alert('Error uploading image');
			}

			isLoadingStore.set(false);

			isLoading = false;
		}
	};
</script>

<svelte:head>
	<title>{user?.username}</title>
</svelte:head>

<Container>
	<div class="flex flex-col w-full gap-4 min-h-[20rem]">
		<section class="flex flex-col md:flex-row gap-4">
			<div
				class="w-full md:w-[30%] 3xl:w-[20%] px-8 py-10 bg-blue-primary rounded-3xl flex flex-col items-center"
			>
				<div class="w-28 h-28 bg-slate-700 rounded-full mb-4 relative">
					<img src={$imageUrl} alt="" class="h-full w-full rounded-full object-cover" />
					{#if locals && locals.user && user.username === locals.user.username}
						<label
							for="image"
							class="btn btn-icon btn-sm bg-white rounded-full absolute z-30 bottom-0 right-0"
						>
							<Icon icon="ic:baseline-edit" class="text-black text-sm" />
						</label>
						<input
							on:change={handleImageSimple}
							type="file"
							name="image"
							id="image"
							class="hidden"
						/>
					{/if}
				</div>
				<p class="font-bold text-2xl">
					{#if user?.firstName || user?.lastName}
						{user?.firstName} {user?.lastName}
					{:else}
						{user?.username}
					{/if}
				</p>
				<div class="flex flex-col gap-1 justify-center items-center">
					<p class="sub-info">{user?.headline ? user.headline : 'No Headline Provided'}</p>
					<p class="sub-info">{user?.company ? user.company : 'No Company Provided'}</p>
					<div class="flex gap-2 items-center">
						<Icon icon="fluent:location-24-regular" class="w-4 h-4" />
						<span class="sub-info">{user?.location ? user.location : 'No Location Provided'}</span>
					</div>
				</div>

				{#if locals && locals.user && user.username === locals.user.username}
					<div class="mt-5">
						<a href={`${user?.username}/edit`}>
							<button class="btn btn-sm variant-filled-secondary">
								<span>Edit Profile</span>
								<Icon icon={ICON['ARROW-OUTWARD']} />
							</button>
						</a>
					</div>
				{/if}
				<div class="relative mt-5 px-3 py-4 border-[1px] border-white w-full rounded-xl mb-4">
					<img class="absolute top-[-1rem] h-[4rem] left-[-1.4rem]" src="/ic-hello.png" alt="" />
					<div class="flex">
						<div class="h-8 w-8"></div>
						<div>
							<p class="text-sm">Say hello to,</p>
							{#if user?.firstName || user?.lastName}
								<span>{user.firstName} {user.lastName}</span>
							{:else}
								<span>{user?.username}</span>
							{/if}
						</div>
					</div>
					<div class="h-[1px] bg-white w-full my-4"></div>
					<p class="text-sm mb-4">Looking for good model?</p>
					<div class="w-full flex justify-center">
						<a href={`mailto:${user?.email}`}>
							<button class="btn btn-sm variant-filled-secondary">
								<span>Send Email</span>
								<Icon icon="akar-icons:arrow-right" class="w-4 h-4" />
							</button>
						</a>
					</div>
				</div>

				<div class="mt-4 w-full">
					<h1 class="font-bold mb-2">About Me</h1>
					<p class="font-thin mb-4">
						{user?.description || 'No description'}
					</p>
				</div>

				<div class="flex flex-col w-full justify-start mb-4">
					<h1 class="font-bold mb-2">Socials</h1>
					<div class="flex flex-col gap-2">
						<div class="flex gap-2 items-center">
							<img class="h-6 rounded-md" src={LOGO['LINKEDIN']} alt="" />
							{#if user?.linkedin}
								<a href={user.linkedin} target="_blank" rel="noreferrer">
									<span class="text-sm hover:underline">{user.linkedin}</span>
								</a>
							{:else}
								<span class="text-sm">No LinkedIn Profile</span>
							{/if}
						</div>
						<div class="flex gap-2 items-center">
							<img class="h-6 rounded-md" src={LOGO['INSTAGRAM']} alt="" />
							{#if user?.instagram}
								<a href={user.instagram} target="_blank" rel="noreferrer">
									<span class="text-sm hover:underline">{user.instagram}</span>
								</a>
							{:else}
								<span class="text-sm">No Instagram Profile</span>
							{/if}
						</div>
						<div class="flex gap-2 items-center">
							<img class="h-6 rounded-md" src={LOGO['BEHANCE']} alt="" />
							{#if user?.behance}
								<a href={user.behance} target="_blank" rel="noreferrer">
									<span class="text-sm hover:underline">{user.behance}</span>
								</a>
							{:else}
								<span class="text-sm">No Behance Profile</span>
							{/if}
						</div>
					</div>
				</div>
			</div>
			<div class="flex-1">
				<p class="font-bold text-3xl mb-4">Posts</p>
				{#if posts && posts.length > 0}
					<div class="flex gap-4 flex-wrap">
						{#each posts as post}
							<Postcard
								{post}
								showOptions={locals?.user && locals.user.username === user.username
									? true
									: undefined}
							/>
						{/each}
					</div>
				{:else}
					<div class="flex w-full flex-col gap-4 justify-center items-center">
						<h3>No posts yet</h3>
						{#if locals && locals.user && user.username === locals.user.username}
							<button class="btn btn-sm variant-filled-secondary px-4 py-3">
								<a href="/upload">Create Post + </a>
							</button>
						{/if}
					</div>
				{/if}
			</div>
		</section>
	</div>
</Container>

<!-- {#if user.profilePicture}
	<div class="w-32 h-32 overflow-hidden bg-slate-700 rounded-full mb-4">
		<img src={user.profilePicture} alt="" class="h-full w-full object-cover" />
	</div>
{:else if $imageUrl !== null}
	<div class="w-32 h-32 overflow-hidden bg-slate-700 rounded-full mb-4">
		<img src={$imageUrl} alt="" class="h-full w-full object-cover" />
	</div>
{:else}
	<label class="w-32 h-32 bg-slate-700 rounded-full mb-4 cursor-pointer relative" for="image">
	</label>
	<input on:change={handleImageSimple} type="file" name="image" id="image" class="hidden" />
{/if} -->

<style lang="postcss">
	.sub-info {
		@apply text-base text-slate-400;
	}
</style>
