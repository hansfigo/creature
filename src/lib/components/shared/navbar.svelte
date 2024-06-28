<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { TITLE } from '$lib/consants';
	import Icon from '@iconify/svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	export let user;

	let userData = user;

	$: userData = user;

	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'bottom'
	};

	let query = '';
</script>

<div class="flex min-w-full justify-center z-[99]">
	<div class="container flex justify-between py-8">
		<a href="/" class="h3 font-bold font-jakarta text-3xl md:text-4xl">{TITLE}</a>
		<div class="w-[40%]">
			<form on:submit|preventDefault={() => goto(`/search?query=${query}`)}>
				<input bind:value={query} type="text" class="input" />
			</form>
		</div>
		{#if userData}
			<div class=" gap-4 justify-center items-center hidden md:flex">
				<p class="font-jakarta">{`Welcome, ${userData.username}`}</p>
				<a class="btn variant-outline-secondary" href={`/u/${userData.username}`}>
					<Icon icon="ic:outline-person" />
				</a>
				<a href="/dashboard/upload" class="btn variant-outline-secondary text-sm">Create Post + </a>
				<!-- <form method="post" use:enhance> -->

				<!-- </form> -->
			</div>
		{:else}
			<div class=" gap-2 hidden md:flex">
				<a href="/signin">
					<button class="btn variant-outline-secondary"> Login </button>
				</a>
				<a href="/signup">
					<button class="btn variant-outline-secondary"> Register </button>
				</a>
			</div>
		{/if}
	</div>
</div>
