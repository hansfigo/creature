<script lang="ts">
	import { goto } from '$app/navigation';
	import Container from '$lib/components/shared/container.svelte';
	import Postcard from '$lib/components/shared/post/postcard.svelte';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { ICON, LOGO } from '$lib/consants';
	import { useFirebase } from '$lib/firebase';
	import { isLoadingStore } from '$lib/state';

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
							{user?.firstName}
							{user?.lastName}
						</div>
					</div>
					<div class="h-[1px] bg-white w-full my-4"></div>
					<p class="text-sm mb-4">Looking for good model?</p>
					<div class="w-full flex justify-center">
						<button class="btn btn-sm variant-filled-secondary">
							<span>Send Email</span>
							<Icon icon="akar-icons:arrow-right" class="w-4 h-4" />
						</button>
					</div>
				</div>

				<div class="mt-4">
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
							<span class="text-sm">{user?.linkedin ? user.linkedin : 'No LinkedIn Profile'}</span>
						</div>
						<div class="flex gap-2 items-center">
							<img class="h-6 rounded-md" src={LOGO['INSTAGRAM']} alt="" />
							<span class="text-sm"
								>{user?.instagram ? user.instagram : 'No Instagram Profile'}</span
							>
						</div>
						<div class="flex gap-2 items-center">
							<img class="h-6 rounded-md" src={LOGO['BEHANCE']} alt="" />
							<span class="text-sm">{user?.behance ? user.behance : 'No Behance Profile'}</span>
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
