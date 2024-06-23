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
	import Icon from '@iconify/svelte';

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
	<div class="flex flex-col w-full gap-4 min-h-[20rem]">
		<section class="h-[20rem] bg-slate-800 rounded-3xl overflow-hidden w-full">
			<img src="/default-banner.png" class="w-full h-full object-cover" alt="" />
		</section>
		<section class="flex flex-col md:flex-row gap-4">
			<div class="w-[20%] px-8 py-10 bg-blue-primary rounded-3xl flex flex-col items-center">
				<div class="w-28 h-28  bg-slate-700 rounded-full mb-4 relative">
					<img src={$imageUrl} alt="" class="h-full w-full rounded-full object-cover" />
					<label for="image" class="btn btn-icon btn-sm bg-white rounded-full absolute z-30 bottom-0 right-0">
						<Icon icon="ic:baseline-edit" class="text-black text-sm" />
					</label>
					<input on:change={handleImageSimple} type="file" name="image" id="image" class="hidden" />
				</div>
				<p class="font-bold text-2xl mb-4">
					{user?.username}
				</p>

				<div class="relative px-3 py-4 border-[1px] border-white w-full rounded-xl mb-4">
					<img class="absolute top-[-1rem] h-[4rem] left-[-1.4rem]" src="/ic-hello.png" alt="">
					<div class="flex">	
						<div class="h-8 w-8">
						</div>
						<div>
							<p class="text-xs">Say hello to,</p>
							<p>{user?.username}</p>
						</div>
					</div>
					<div class="h-[1px] bg-white w-full my-4">
						
					</div>
					<p class="text-xs mb-4">Looking for good model?</p>
					<div class="w-full flex justify-center">
						<button class="btn btn-sm variant-filled-secondary text-xs">Contact 
							<Icon icon="akar-icons:arrow-right" class="w-4 h-4" />
						</button>
					</div>
				</div>

				<div>
					<h1>About Me</h1>
					<p class="font-thin mb-4">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga eius mollitia beatae hic
						veniam ab perspiciatis fugiat sunt assumenda quam eligendi deleniti minima optio odio
						placeat ipsa obcaecati, qui nisi.
					</p>
				</div>
				<!-- <div class="flex gap-4">
					<a href="/dashboard/upload" class="btn variant-outline-secondary">Create Post + </a>
					<button on:click={() => goto('/signout')} class="btn variant-filled-error">
						<span>Logout</span>
					</button>
				</div> -->
			</div>
			<div class="flex-1">
				<p class="font-bold text-3xl mb-4">Your Posts</p>
				{#if posts && posts.length > 0}
					<div class="flex gap-4 flex-wrap">
						{#each posts as post}
							<Postcard {post} />
						{/each}
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
