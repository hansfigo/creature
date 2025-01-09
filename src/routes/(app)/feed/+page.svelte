<script lang="ts">
	import { goto } from '$app/navigation';
	import Carousel from '$lib/components/Carousel.svelte';
	import Postcard from '$lib/components/shared/post/postcard.svelte';
	import { ICON } from '$lib/consants.js';
	import Icon from '@iconify/svelte';

	export let data;

	const posts = data.postList;
</script>

<main class="flex justify-center min-h-screen w-full gap-4 px-0 md:px-8">
	<div class="container">
		<section class="flex flex-col gap-4">
			<div
				class="h-screen md:h-full flex flex-col-reverse md:flex-row gap-8 justify-center md:items-center items-start md:mb-16"
			>
				<div class="md:w-[70%]">
					<h1 class="text-center md:text-left text-4xl md:text-[4rem] leading-tight font-black">
						The medium for 3D interest and the creator
					</h1>
					<br />
					<div class="flex w-full justify-center md:justify-end gap-4 flex-row md:pr-8">
						<div>
							<a href="/upload">
								<button class="btn variant-filled-secondary text-lg"
									>Join
									<Icon class="ml-2" icon="ic:baseline-arrow-outward" />
								</button>
							</a>
						</div>
						<div>
							<a href="/upload">
								<button class="btn variant-filled-secondary text-lg"
									>Post
									<Icon class="ml-2" icon="ic:baseline-arrow-outward" />
								</button>
							</a>
						</div>
					</div>
				</div>
				<div class="h-[20rem] md:h-[40rem] w-full overflow-hidden rounded-2xl">
					<img class="h-full w-full object-contain" src="/hero-img.png" alt="" />
				</div>
			</div>

			<section class="md:h-[30rem] flex items-center w-full">
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-stretch w-full">
					<div>
						<div class="w-full h-60 rounded-3xl overflow-hidden border-[1px] border-slate-800">
							<img src="/advantage-1.png" class="w-full h-full object-cover" alt="" />
						</div>
						<div class="flex gap-2 mt-2">
							<p>Add friends around you and invite them to collaborate</p>
						</div>
					</div>

					<div>
						<div class="w-full h-60 rounded-3xl overflow-hidden border-[1px] border-slate-800">
							<img src="/advantage-3.png" class="w-full h-full object-cover" alt="" />
						</div>
						<div class="flex gap-2 mt-2">
							<p>Make them more alive with animations</p>
						</div>
					</div>

					<div>
						<div class="w-full h-60 rounded-3xl overflow-hidden border-[1px] border-slate-800">
							<img src="/advantage-2.png" class="w-full h-full object-cover" alt="" />
						</div>
						<div class="flex gap-2 mt-2">
							<p>Use lighting to make it more real</p>
						</div>
					</div>
				</div>
			</section>

			<section class="hidden md:block mt-16">
				<div class="flex w-full justify-between">
					<h1 class="text-lg mb-6 md:text-3xl font-bold">Top Rated</h1>
					<a class="flex items-center gap-2 text-cyan-500" href="/search">
						<span>Explore All Models</span>
						<Icon icon={ICON['ARROW-OUTWARD']} />
					</a>
				</div>
				<Carousel posts={data.topRatedPosts} />
			</section>

			<section class="mt-16">
				<div class="flex w-full justify-between">
					<h1 class="text-lg mb-6 md:text-3xl font-bold">Latest Upload</h1>
					<a class="flex items-center gap-2 text-cyan-500" href="/search">
						<span>Explore All Models</span>
						<Icon icon={ICON['ARROW-OUTWARD']} />
					</a>
				</div>
				<div class="grid grid-cols-1 gap-8 md:grid-cols-3 xl:grid-cols-4">
					{#if posts.length > 0}
						{#each posts.reverse() as post}
							<Postcard {post} />
						{/each}
					{/if}
				</div>
			</section>
		</section>
	</div>
</main>
