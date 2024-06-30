<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<section class="flex justify-center items-center min-h-[88vh] w-full">
	<div
		class="flex relative flex-col md:flex-row rounded-3xl bg-blue-primary overflow-hidden md:w-[60%] md:min-h-[30rem] md:max-h-[40rem]"
	>
		<div class="md:w-[50%] h-[14rem] md:h-full overflow-hidden">
			<img class="object-cover h-full w-full" src="/backdrop-login.png" alt="" />
		</div>
		<form
			method="POST"
			use:enhance
			enctype="multipart/form-data"
			class="min-h-full px-8 py-6 flex-1 ,md:w-[80%]"
		>
			<div class="flex w-full justify-between items-center">
				<p class="text-2xl md:text-4xl font-bold">Register</p>
				<button class="h-full text-3xl" type="button">
					<a href="/">
						<Icon icon="ic:baseline-arrow-outward" />
					</a>
				</button>
			</div>
			<br />
			<br />

			<label class="label" for="email">Email</label>
			<input class="input" type="text" name="email" id="email" />

			<br />
			<br />

			<label class="label" for="username">Username</label>
			<input class="input" type="text" name="username" id="username" />

			<br />
			<br />

			<div class="flex gap-2">
				<div>
					<label class="label" for="username">Firstname</label>
					<input class="input" type="text" name="username" id="username" />
				</div>

				<div>
					<label class="label" for="username">Lastname</label>
					<input class="input" type="text" name="username" id="username" />
				</div>
			</div>

			<br />

			<label class="label" for="password">Password</label>
			<input class="input" type="password" name="password" id="password" />

			{#if form?.error}
				<p class="text-red-500">{form.message}</p>
			{/if}
			<br />
			<br />
			<p class="text-center">
				Already Have Account ? <a href="/signin" class="text-blue-400 font-bold">Login</a>
			</p>
			<br />
			<div class="w-full text-center">
				<button type="submit" class="btn variant-outline-secondary">Submit</button>
			</div>
		</form>
	</div>
</section>

<style>
	label {
		margin-bottom: 4px;
	}
</style>
