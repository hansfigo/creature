<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { TITLE } from '$lib/consants';
	import Icon from '@iconify/svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	export let user;
	export let userDetail;

	let userData = user;

	$: userData = user;

	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'bottom'
	};

	let query = '';
</script>

<div class="flex min-w-full justify-center items-center z-[99]">
	<div class="container flex justify-between items-center py-8">
		<a href="/" class="h3 font-bold font-jakarta text-3xl md:text-4xl">{TITLE}</a>
		<div class="w-[0%] sm:w-[30%] xl:w-[40%]">
			<form on:submit|preventDefault={() => goto(`/search?query=${query}`)}>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim bg-transparent">
						<Icon icon="ic:outline-search" />
					</div>
					<input type="search" placeholder="Search..." />
				</div>
			</form>
		</div>
		{#if userData}
			<div class=" gap-4 justify-center items-center hidden md:flex">
				<!-- <p class="font-jakarta">{`Welcome, ${userData.username}`}</p> -->
				 <button class="btn variant-outline-secondary relative">
					<Icon icon="ic:outline-notifications" />
					<div class="h-2 w-2 rounded-full absolute bg-red-600">
					</div>
				 </button>
				<button use:popup={popupClick} class="btn variant-outline-secondary">
					<Icon icon="ic:outline-person" />
				</button>
				<div class="card p-4 min-w-[16rem] variant-filled" data-popup="popupClick">
					{#if userData}
						<div class="flex items-center flex-col w-full justify-center ">
							<img src={userDetail.profilePicture} class="w-20 h-20 rounded-full mb-3" alt="" />
							<p class="font-bold">{userData.username}</p>
							<p>{userDetail.email}</p>
						</div>
						<br />
						<div class="flex flex-col items-start justify-start gap-2 variant-filled">
							<a href="/dashboard/upload">
								<button class="btn btn-sm">Upload</button>
							</a>
							<a href={`/u/${userData.username}`}>
								<button class="btn btn-sm">Profile</button>
							</a>
							<a href={`/u/${userData.username}/bookmarks`}>
								<button class="btn btn-sm">Bookmarks</button>
							</a>
							<button class="btn btn-sm">Guide</button>
						</div>
					{:else}
						<a href="/signin">
							<button class="btn btn-sm">Login</button>
						</a>
						<a href="/signup">
							<button class=" btn-sm">Register</button>
						</a>
					{/if}

					{#if userData}
						<div class="flex w-full justify-center">
							<button
								on:click={() => goto('/signout')}
								class="btn btn-sm mt-4 variant-filled-error"
							>
								<span>Logout</span>
								<Icon icon="ic:outline-exit-to-app" />
							</button>
						</div>
					{/if}
					<div class="arrow variant-filled" />
				</div>

				<!-- <a href="/dashboard/upload" class="btn variant-outline-secondary text-sm">Create Post + </a> -->
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
