<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import type { PageData } from './$types';

	export let form: ActionData;
</script>

<section class="flex justify-center items-center w-screen h-screen">
	<form method="POST" use:enhance enctype="multipart/form-data">
		<p class="text-4xl font-bold">Login</p>

		<br />
		<br />
		
		<label class="label" for="username">Username</label>
		<input class="input" type="username" name="username" id="username" />

		<br />
		<br />

		<label class="label" for="password">Password</label>
		<input class="input" type="password" name="password" id="password" />

		{#if form?.error}
			<p class="text-red-500">{form.message}</p>
		{/if}
		<br />
		<br />

		<br />
		<button type="submit" class="btn variant-ghost-primary">Submit</button>
	</form>
</section>
