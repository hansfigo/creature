<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { TITLE } from '$lib/consants';
	import Icon from '@iconify/svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	export let user;


	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'bottom'
	};
</script>

{#if user}
	<!-- <div class="card p-4 variant-filled-primary flex flex-col" data-popup="popupClick">
		<button class="btn">
			<a href={`/u/${user.username}`}>Profile</a>
		</button>
		<form method="post" use:enhance>
			<button class="btn">
				<span>Logout</span>
			</button>
		</form>

		<div class="arrow variant-filled-primary" />
	</div> -->
{/if}

<div class="flex min-w-full justify-center mb-12 z-[99]">
	<div class="container flex justify-between py-8">
		<a href="/" class="h3 font-bold font-jakarta text-4xl">{TITLE}</a>
		<p></p>
		{#if user}
			<div class=" gap-4 justify-center items-center hidden md:flex">
				<p class="font-jakarta">{`Welcome, ${user.username}`}</p>
				<button class="btn border-[1px] border-white" >
					<a href={`/u/${user.username}`}>
						<Icon icon="ic:outline-person" />
					</a>
				</button>
				<!-- <form method="post" use:enhance> -->
					
				<!-- </form> -->
			</div>
		{:else}
			<div class=" gap-2 hidden md:flex">
				<button class="btn variant-outline-secondary">
					<a href="/signin"> Login </a>
				</button>
				<button class="btn variant-outline-secondary">
					<a href="/signup"> Register </a>
				</button>
			</div>
		{/if}
	</div>
</div>
