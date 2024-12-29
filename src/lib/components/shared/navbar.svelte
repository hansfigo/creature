<script lang="ts">
	import { goto } from '$app/navigation';
	import { TITLE } from '$lib/consants';
	import { isHamburgerMenuOpen } from '$lib/state';
	import Icon from '@iconify/svelte';
	import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';

	export let user;
	export let userDetail;
	export let url;

	let userData = user;
	let pageUrl = url;

	$: {
		userData = user;
		pageUrl = url;
	}

	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'bottom'
	};

	const notificationPopupClick: PopupSettings = {
		event: 'click',
		target: 'notificationPopupClick',
		placement: 'bottom'
	};

	const hamburgerClick: PopupSettings = {
		event: 'click',
		target: 'hamburgerClick',
		placement: 'bottom'
	};

	let query = '';

	const toggleHamburgerMenu = () => {
		isHamburgerMenuOpen.update((n) => !n);
	};
</script>

<div class="flex min-w-full justify-center items-center z-[99] px-0 md:px-8 relative flex-col">
	<div class="container flex justify-between items-center md:py-8 py-6 px-4">
		<a href="/" class="h3 font-bold font-jakarta text-2xl md:text-4xl">{TITLE}</a>
		<div class="hidden md:block w-[0%] sm:w-[30%] xl:w-[40%]">
			<form on:submit|preventDefault={() => goto(`/search?query=${query}`)}>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim bg-transparent">
						<Icon icon="ic:outline-search" />
					</div>
					<input type="search" bind:value={query} placeholder="Search..." />
				</div>
			</form>
		</div>
		<!-- MOBILE VIEW -->
		<div class="md:hidden block">
			<button on:click={toggleHamburgerMenu} class="btn variant-outline-secondary">
				<Icon icon="ic:outline-menu" />
			</button>
			<div class="card p-4 min-w-[20rem] bg-initial" data-popup="hamburgerClick">
				<div class=" gap-2 md:flex">
					<a href="/guide">
						<button class="btn variant-outline-secondary">Guide</button>
					</a>
					<a href="/signin">
						<button class="btn variant-outline-secondary"> Login </button>
					</a>
					<a href="/signup">
						<button class="btn variant-outline-secondary"> Register </button>
					</a>
				</div>
			</div>
		</div>
		{#if userData}
			<div class=" gap-4 justify-center items-center hidden md:flex">
				<!-- <p class="font-jakarta">{`Welcome, ${userData.username}`}</p> -->
				<a href="/pricing">
					<button class="btn variant-outline-secondary">Pricing</button>
				</a>
				<a href="/guide">
					<button class="btn variant-outline-secondary">Guide</button>
				</a>
				<button use:popup={notificationPopupClick} class="btn variant-outline-secondary relative">
					<Icon icon="ic:outline-notifications" />
					{#if userDetail.hasUnreadNotification}
						<div class="h-2 w-2 rounded-full absolute bg-red-600"></div>
					{/if}
				</button>
				<div class="card p-4 min-w-[20rem] variant-filled" data-popup="notificationPopupClick">
					<p class="font-black mb-3">Notification</p>
					{#if userDetail.notifications && userDetail.notifications.length === 0}
						<p>No notification</p>
					{:else}
						<div class="flex flex-col gap-2 items-start">
							{#each userDetail.notifications as notifications}
								<button class="btn px-0 w-full flex justify-between">
									{#if notifications.post}
										<a href={`/p/${notifications.post.id}?notId=${notifications.id}`}>
											<span>{notifications.message} {notifications.post.title}</span>
										</a>
									{:else}
										<a href={`/noti/${notifications.id}?from=${url}`}>
											<span>{notifications.message}</span>
										</a>
									{/if}
									{#if notifications.isRead == false}
										<div class="h-2 w-2 rounded-full bg-red-600"></div>
									{/if}
								</button>
							{/each}
						</div>
					{/if}
				</div>
				<button use:popup={popupClick} class="btn variant-outline-secondary">
					<Icon icon="ic:outline-person" />
				</button>
				<div class="card p-4 min-w-[16rem] variant-filled" data-popup="popupClick">
					{#if userData}
						<div class="flex items-center flex-col w-full justify-center">
							<img src={userDetail.profilePicture} class="w-20 h-20 rounded-full mb-3" alt="" />
							<p class="font-bold">{userData.username}</p>
							<p>{userDetail.email}</p>
							<p class="chip variant-filled-secondary mt-2">{userDetail.active_plan}</p>
						</div>
						<br />
						<div class="flex flex-col items-start justify-start gap-2 variant-filled">
							<a href="/upload">
								<button class="btn btn-sm">Upload</button>
							</a>
							<a href={`/u/${userData.username}`}>
								<button class="btn btn-sm">Profile</button>
							</a>
							<a href={`/u/${userData.username}/bookmarks`}>
								<button class="btn btn-sm">Bookmarks</button>
							</a>
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
			</div>
		{:else}
			<div class=" gap-2 hidden md:flex">
				<a href="/pricing">
					<button class="btn variant-outline-secondary">Pricing</button>
				</a>
				<a href="/guide">
					<button class="btn variant-outline-secondary">Guide</button>
				</a>
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
<div
	class={`fixed top-0 left-0 w-full h-full z-[100] justify-between flex flex-col px-4 py-6  bg-blue-primary/70 backdrop-blur-md	 text-white transition-transform transform ${
		$isHamburgerMenuOpen ? 'translate-x-0' : '-translate-x-full'
	}`}
>
	{#if userData}
		<div>
			<div class="flex w-full justify-end">
				<button on:click={toggleHamburgerMenu}>
					<svg
						class="w-6 h-6 text-gray-800 dark:text-white"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18 17.94 6M18 18 6.06 6"
						/>
					</svg>
				</button>
			</div>

			<div class="mb-4 flex flex-col gap-2">
				<Avatar src={userDetail.profilePicture} width="w-20" rounded="rounded-full" />
				<h3 class="text-xl">Welcome, {userData.username}</h3>
				<div>
					<p class="chip variant-filled-secondary">{userDetail.active_plan}</p>
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<a
					on:click={toggleHamburgerMenu}
					href={`/upload`}
					class="py-5 border-b-[1px] border-white/40 hover:font-black hover:border-white transition-all duration-300"
				>
					Upload
				</a>
				<a
					on:click={toggleHamburgerMenu}
					href={`/u/${userData.username}`}
					class="py-5 border-b-[1px] border-white/40 hover:font-black hover:border-white transition-all duration-300"
				>
					Profile
				</a>
				<a
					on:click={toggleHamburgerMenu}
					href={`/u/${userData.username}/bookmarks`}
					class="py-5 border-b-[1px] border-white/40 hover:font-black hover:border-white transition-all duration-300"
				>
					Bookmarks
				</a>
				<a
					on:click={toggleHamburgerMenu}
					href={`/pricing`}
					class="py-5 border-b-[1px] border-white/40 hover:font-black hover:border-white transition-all duration-300"
				>
					Upgrade Account
				</a>
				<a
					on:click={toggleHamburgerMenu}
					href="/guide"
					class="py-5 border-b-[1px] border-white/40 hover:font-black hover:border-white transition-all duration-300"
				>
					Guide
				</a>
			</div>
		</div>
		<button
			on:click={() => {
				goto('/signout');
				toggleHamburgerMenu();
			}}
			class="btn variant-filled-error"
		>
			<a href="/signout">Logout</a>
		</button>
	{:else}
		<div>
			<div class="flex w-full justify-end">
				<button on:click={toggleHamburgerMenu}>
					<svg
						class="w-6 h-6 text-gray-800 dark:text-white"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18 17.94 6M18 18 6.06 6"
						/>
					</svg>
				</button>
			</div>

			<div class="flex flex-col gap-2">
				<a
					on:click={toggleHamburgerMenu}
					href="/guide"
					class="py-5 border-b-[1px] border-white/40 hover:font-black hover:border-white transition-all duration-300"
				>
					Guide
				</a>
				<a
					on:click={toggleHamburgerMenu}
					href="/signin"
					class="py-5 border-b-[1px] border-white/40 hover:font-black hover:border-white transition-all duration-300"
				>
					Login
				</a>
				<a
					on:click={toggleHamburgerMenu}
					href="/signup"
					class="py-5 border-b-[1px] border-white/40 hover:font-black hover:border-white transition-all duration-300"
				>
					Register
				</a>
			</div>
		</div>

		<div class="w-full flex flex-col justify-center gap-2">
			<button on:click={toggleHamburgerMenu} class="btn variant-outline-secondary">
				<a href="/signin">Login</a>
			</button>
			<button on:click={toggleHamburgerMenu} class="btn variant-filled-secondary">
				<a href="/signup">Register</a>
			</button>
		</div>
	{/if}
</div>
