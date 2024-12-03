<script lang="ts">
	import Container from '$lib/components/shared/container.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let card = 'card';
</script>

<Container>
	<h1 class="text-[3.4rem] font-bold mt-20">Find a plan to power your projects</h1>

	<div class="flex gap-4 mt-44">
		<p>Plan 1</p>
		<p>Plan 2</p>
		<!-- <div class="card variant-ghost-surface shadow-lg px-5 py-4">
			<h1 class="font-bold text-2xl mb-2">Basic</h1>
			<p class="text-lg">Designed for beginners and hobbyists to explore and share their 3D creations.</p>
			<ul class="list-disc pl-5 mb-4 mt-2">
				<li class="">Max file size per upload: <span class="font-medium">30MB</span></li>
				<li class="">Max posts allowed: <span class="font-medium">8</span></li>
				<li class="">Access to basic analytics for uploaded models</li>
				<li class="">Limited to one featured project on profile</li>
				<li class="">Community support via forums and FAQs</li>
			</ul>
			<div class="flex items-center mb-4">
				<span class="font-semibold text-xl">Free</span>
			</div>
			<button class="btn variant-filled-secondary w-full">Start Uploading</button>
		</div>

		<div class="">
			<h1>Pro</h1>
			<p>for profesional 3d artist</p>
			<button> Upgrade now</button>
		</div> -->
	</div>
</Container>
