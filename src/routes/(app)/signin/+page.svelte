<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import type { ActionData } from './$types';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	export let form: ActionData;

	export let data;
	onMount(() => {
		if (data.param && data.param === 'true') {
			// Hapus parameter query dari URL setelah reload
			const url = new URL(window.location.href);
			url.searchParams.delete('invalidate');
			window.history.replaceState({}, document.title, url.toString());

			// Reload halaman
			location.reload();
		}
	});
</script>

<section class="flex justify-center items-center min-h-[88vh] w-full">
	<div
		class="flex relative flex-col md:flex-row rounded-3xl bg-blue-primary overflow-hidden md:w-[60%] md:min-h-[30rem] md:max-h-[30rem]"
	>
		<div class="md:w-[50%] h-[14rem] md:h-full overflow-hidden">
			<img class="object-cover h-full w-full" src="/backdrop-login.png" alt="" />
		</div>
		<form
			method="POST"
			use:enhance
			enctype="multipart/form-data"
			class="min-h-full px-8 py-6 flex-1 md:w-[80%]"
		>
			<div class="flex w-full justify-between items-center">
				<p class="text-2xl md:text-4xl font-bold">Login</p>
				<button class="h-full text-3xl" type="button">
					<a href="/">
						<Icon icon="ic:baseline-arrow-outward" />
					</a>
				</button>
			</div>
			<br />
			<br />

			<label class="label" for="username">Username</label>
			<input class="input" type="text" name="username" id="username" />

			<br />
			<br />

			<label class="label" for="password">Password</label>
			<input class="input" type="password" name="password" id="password" />

			{#if form?.error}
				<p class="text-red-500">{form.message}</p>
			{/if}
			<br />
			<br />
			<p class="text-center">
				New User ? <a href="/signup" class="text-blue-400 font-bold">Create New Account</a>
			</p>
			<br />
			<div class="w-full text-center">
				<button type="submit" class="btn variant-outline-secondary">Submit</button>
			</div>
		</form>
	</div>
</section>
