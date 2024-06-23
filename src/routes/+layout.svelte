<script lang="ts">
	// @ts-nocheck

	import { page } from '$app/stores';
	import Footer from '$lib/components/shared/footer.svelte';
	import Navbar from '$lib/components/shared/navbar.svelte';
	import { initializeStores } from '@skeletonlabs/skeleton';

	import '../app.pcss';

	initializeStores();


	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';

	import { storePopup } from '@skeletonlabs/skeleton';
	import { get } from 'svelte/store';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	export let data;

	const url = (get(page).route).id?.toString()

	const isShow =() => {
		if (url == '/signin' || url == '/signup') {
			return false;
		} else {
			return true;
		}
	} 
	
	console.log(isShow());
</script>

<div
	class="relative bg-main plus-jakarta-sans min-h-screen h-full flex flex-col overflow-y-hidden overflow-x-hidden px-14 4xl:px-0 justify-between"
>
	<div class="ball-gradient"></div>
	<div class="ball-gradient-2"></div>

	{#if $page.route.id !== '/signin' && $page.route.id !== '/signup'}
		<Navbar user={data.user} />
	{/if}

	<div class=" flex-1 z-10">
		<slot />
	</div>
	
	<div class="footer-gradient z-0"></div>
	<br /><br /><br />
	{#if $page.route.id !== '/signin' && $page.route.id !== '/signup'}
		<Footer />
	{/if}
</div>

<style>
	:root {
		--color-bg1: rgb(108, 0, 162);
		--color-bg2: rgb(0, 17, 82);
		--color1: 0, 194, 255;
		--color2: 221, 74, 255;
		--color3: 100, 220, 255;
		--color4: 200, 50, 50;
		--color5: 180, 180, 50;
		--color-interactive: 140, 100, 255;
		--circle-size: 80%;
		--blending: hard-light;
	}

	.bg-main {
		background: rgba(14, 2, 49, 1);
	}

	.plus-jakarta-sans {
		font-family: 'Plus Jakarta Sans', sans-serif;
		font-optical-sizing: auto;
		font-weight: 400;
		font-style: normal;
	}

	.ball-gradient {
		position: absolute;
		top: 0;
		left: -16rem;
		width: 80%;
		height: 80%;
		background: radial-gradient(
				circle at center,
				rgba(var(--color1), 0.75) 0,
				rgba(var(--color1), 0) 40%
			)
			no-repeat;
		mix-blend-mode: soft-light;
		transform-origin: center center;

		animation: moveVertical 10s ease infinite;
	}

	.ball-gradient-2 {
		z-index: 0;
		position: absolute;
		bottom: 0;
		right: -36rem;
		width: 86%;
		height: 86%;
		background: radial-gradient(
				circle at center,
				rgba(var(--color1), 0.8) 0,
				rgba(var(--color1), 0) 40%
			)
			no-repeat;
		mix-blend-mode: soft-light;

		animation: moveInCircle 30s ease infinite;
	}

	.footer-gradient {
		position: absolute;
		bottom: 0;
		right: 0;
		height: 40%;
		min-width: 100%;
		background: linear-gradient(to bottom, transparent, rgba(var(--color1), 0.3));
		backdrop-filter: blur(5px); /* Menambahkan blur */
	}

	@keyframes moveInCircle {
		0% {
			transform: rotate(0deg);
		}
		50% {
			transform: rotate(180deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes moveVertical {
		0% {
			transform: translateY(-50%);
		}
		50% {
			transform: translateY(50%);
		}
		100% {
			transform: translateY(-50%);
		}
	}

	@keyframes moveHorizontal {
		0% {
			transform: translateX(-50%) translateY(-10%);
		}
		50% {
			transform: translateX(50%) translateY(10%);
		}
		100% {
			transform: translateX(-50%) translateY(-10%);
		}
	}
</style>
