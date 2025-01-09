<script lang="ts">
	import { navigating, page } from '$app/stores';
	import Footer from '$lib/components/shared/footer.svelte';
	import Navbar from '$lib/components/shared/navbar.svelte';
	import { ProgressBar } from '@skeletonlabs/skeleton';

	import { TITLE } from '$lib/consants';
	import { isLoadingStore } from '$lib/state';
	import { get } from 'svelte/store';

	export let data;
	
	let userDetail = data.userDetail;
	let user = data.user;

	$: user = $page.data.user;
	$: userDetail = $page.data.userDetail;

	const url = get(page).route.id?.toString();

</script>

<svelte:head>
	<title>{TITLE}</title>
</svelte:head>

<div
	class="relative plus-jakarta-sans min-h-screen h-full flex flex-col overflow-y-hidden overflow-x-hidden justify-between"
>
	{#if $page.route.id !== '/(app)/signin' && $page.route.id !== '/(app)/signup'}
		<Navbar {user} {url} {userDetail} />
		<p>{$page.route.id}</p>
	{/if}

	{#if $navigating || $isLoadingStore}
		<div class="fixed w-full left-0 top-0 z-[100]">
			<ProgressBar />
		</div>
	{/if}

	<div class=" flex-1 z-10 px-4 4xl:px-0">
		<slot />
	</div>

	<br /><br /><br />
	{#if $page.route.id !== '/(app)/signin' && $page.route.id !== '/(app)/signup'}
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

	@media (max-width: 768px) {
		.ball-gradient {
			left: -8rem;
			width: 100%;
			height: 100%;
			transform: scale(0.8);
			border-radius: 99rem;
			background: radial-gradient(
					circle at center,
					rgba(var(--color1), 0.75) 0,
					rgba(var(--color1), 0) 10%
				)
				no-repeat;

			animation: moveVertical 20s ease infinite;
		}

		.ball-gradient-2 {
			right: -20rem;
			width: 100%;
			height: 100%;
			transform: scale(0.9);
			border-radius: 99rem;
			background: radial-gradient(
					circle at center,
					rgba(var(--color1), 0.8) 0,
					rgba(var(--color1), 0) 10%
				)
				no-repeat;
		}
	}
</style>
