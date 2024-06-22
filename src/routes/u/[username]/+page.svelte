<script lang="ts">
	import { goto } from '$app/navigation';
	import Container from '$lib/components/shared/container.svelte';
	import Postcard from '$lib/components/shared/post/postcard.svelte';
	import { get, writable } from 'svelte/store';
	import type { PageData } from './$types';
	import Cropper from 'svelte-easy-crop';
	import {
		Modal,
		ProgressRadial,
		getModalStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import ImageCropper from '$lib/components/shared/ImageCropper.svelte';
	import { is } from 'drizzle-orm';

	export let data: PageData;
	const modalStore = getModalStore();

	const image = writable<HTMLInputElement | null>(null);
	const imageUrl = writable<string | null>(null);
	let isLoading = false;

	const { posts, user, locals, p } = data;

	const handleImage = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0] as File;
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				imageUrl.set(e.target?.result as string);

				const modalComponent: ModalComponent = {
					ref: ImageCropper,
					props: {
						image: e.target?.result as string,
						onCropComplete: (e: any) => console.log(e, 'PPPPPPPP'),
						classList: 'w-[20rem] h-[20rem] bg-black relative z-[99]'
					}
				};

				const modal: ModalSettings = {
					type: 'component',
					component: modalComponent
				};

				modalStore.trigger(modal);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleImageSimple = async (e: Event) => {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0] as File;

		if (file) {
			imageUrl.set(URL.createObjectURL(file));

			isLoading = true;

			const formData = new FormData();
			formData.append('profilePicture', file);

			const res = await fetch(`/api/user/${user?.username}`, {
				method: 'PUT',
				body: formData
			});

			if (res.ok) {
				const data = await res.json();
				console.log(data, 'data');
			} else {
				alert('Error uploading image');
				console.log('error');
			}

			isLoading = false;
		}
	};
</script>

<svelte:head>
	<title>{user?.username}</title>
</svelte:head>

<Container>
	<div class="flex flex-col gap-12 min-h-[20rem]">
		{#if user}
			<!-- {#if $imageUrl !== null}
				<Modal />
			{/if} -->
			<div>
				{#if user.profilePicture}
					<div class="w-32 h-32 overflow-hidden bg-slate-700 rounded-full mb-4">
						<img src={user.profilePicture} alt="" class="h-full w-full object-cover" />
					</div>
				{:else if $imageUrl !== null}
					<div class="w-32 h-32 overflow-hidden bg-slate-700 rounded-full mb-4">
						<img src={$imageUrl} alt="" class="h-full w-full object-cover" />
					</div>
				{:else}
					<label
						class="w-32 h-32 bg-slate-700 rounded-full mb-4 cursor-pointer relative"
						for="image"
					>
					</label>
					<input on:change={handleImageSimple} type="file" name="image" id="image" class="hidden" />
				{/if}
				<p class="font-bold text-4xl mb-4">
					{user?.username}
				</p>
				<div class="flex gap-4">
					<a href="/dashboard/upload" class="btn variant-outline-secondary">Create Post + </a>
					<button on:click={() => goto('/signout')} class="btn variant-filled-error">
						<span>Logout</span>
					</button>
				</div>
			</div>
		{/if}

		<div>
			<p class="font-bold text-3xl mb-4">Your Posts</p>
			{#if posts && posts.length > 0}
				<div class="flex gap-4">
					{#each posts as post}
						<Postcard {post} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</Container>
