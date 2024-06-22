<script lang="ts">
	import { goto } from '$app/navigation';
	import Navbar from '$lib/components/shared/navbar.svelte';
	import Postcard from '$lib/components/shared/post/postcard.svelte';
	import { removeGlbExtension } from '$lib/utils.js';
	import Icon from '@iconify/svelte';

	export let data;

	console.log(data);

	const posts = data.postList;

	// const models = data.models.map((model: string) => removeGlbExtension(model));
</script>

<main class="flex justify-center min-h-screen w-full gap-4">
	<div class="container">
		<section class="flex flex-col gap-4">
			<div class="grid h-full md:grid-cols-2 gap- content-center items-center mb-16">
				<div class="w-[70%]">
					<h1 class="text-[4rem] leading-tight font-black">
						The medium for 3D interest and the creator
					</h1>
					<br>
					<div class="flex flex-col w-full justify-end gap-4 md:flex-row md:pr-8">
						<div>
							<button class="btn variant-filled-secondary text-lg">Join
								<Icon class="ml-2" icon="ic:baseline-arrow-outward"/>
							</button>
						</div>
						<div>
							<button class="btn variant-filled-secondary text-lg">Post
								<Icon class="ml-2" icon="ic:baseline-arrow-outward"/>
							</button>
						</div>
					</div>
				</div>
				<div class="h-[30rem] w-full bg-slate-800 overflow-hidden rounded-2xl">
					<img class="h-full w-full object-cover" src="https://lh6.googleusercontent.com/proxy/qHZjYOyDk62_G4zO4GArH5BvfdjLSJ5Ov96_912gs2tenHaeRKJDFfVh5hBp8OUX4LbZ_MIkx2a_G9LGq9iSUFJZVTtUZFzVriovkt6-vT59-Na5cd38ktXdRi1G1JBuznxXScvgxr_5O6hF" alt="">
				</div>
			</div>
			<h1 class="text-3xl font-bold">Latest Upload</h1>
			<div class="grid grid-cols-2 gap-8 md:grid-cols-3 xl:grid-cols-4">
				{#each posts as post}
					<Postcard {post} />
				{/each}
			</div>
		</section>
	</div>
</main>
