<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { LayoutData } from './$types';
	import { writable } from 'svelte/store';
	import { useFirebase } from '$lib/firebase';

	export let data: LayoutData;

	const imageUrl = writable<string | null>(
		data.userDetail.bannerPicture ? data.userDetail.bannerPicture : '/default-banner.png'
	);

	const handleImageSimple = async (e: Event) => {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0] as File;

		if (file) {
			imageUrl.set(URL.createObjectURL(file));

			const bannerPicture = await useFirebase.uploadFile({
				file: file,
				path: '/users/bannerPictures/'
			});

			const formData = new FormData();
			formData.append('bannerPicture', bannerPicture);

			const res = await fetch(`/api/user/${data.user?.username}`, {
				method: 'PUT',
				body: formData
			});

			if (res.ok) {
				const data = await res.json();
			} else {
				alert('Error uploading image');
			}
		}
	};
</script>

<div>
	<div class="flex flex-col justify-center items-center w-full gap-4 min-h-[20rem] mb-8">
		<div class="container">
			<section class="h-[20rem] relative bg-slate-800 rounded-3xl overflow-hidden w-full">
				<img src={$imageUrl} class="w-full h-full object-cover" alt="" />
				{#if data.user && data.userDetail.username === data.user.username}
					<div class="absolute bottom-4 right-4">
						<label for="banner" class="btn rounded-full bg-white text-black">
							<Icon icon="ic:baseline-edit" class="" />
						</label>
						<input
							on:change={handleImageSimple}
							type="file"
							name="banner"
							id="banner"
							class="hidden"
						/>
					</div>
				{/if}
			</section>
		</div>
	</div>
	<slot />
</div>
