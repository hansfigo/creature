<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<section class="flex justify-center items-center min-h-[88vh] w-full">
	<div class="flex rounded-3xl bg-blue-primary overflow-hidden w-[60%] min-h-[30rem]">
		<div class="w-[50%] overflow-hidden">
			<img
				class="object-cover h-full w-full"
				src="https://media.sketchfab.com/models/623b7b08bd514f64a1828a51e5d8dfd2/thumbnails/f73224089cb843f6a4cab3cf6638ef71/55b7acef6aee460d8ca63cc10b71873a.jpeg"
				alt=""
			/>
		</div>
		<form
			method="POST"
			use:enhance
			enctype="multipart/form-data"
			class="min-h-full px-8 py-6 flex-1 w-[80%]"
		>
			<div class="flex w-full justify-between items-center">
				<p class="text-4xl font-bold">Regiter</p>
				<button class="h-full text-3xl" type="button">
					<a href="/">
						<Icon icon="ic:baseline-arrow-outward"/>
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
