<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import type { PageData } from './$types';

	export let form: ActionData;

</script>

<section class="flex justify-center items-center w-screen h-screen">
	<form method="POST" use:enhance>
	
		<label class="label" for="username">Username</label>
		<input class="input" type="username" name="username" id="username" />

		<label class="label" for="first_name">First Name</label>
		<input class="input" type="first_name" name="first_name" id="first_name" />

		<label class="label" for="last_name">Last Name</label>
		<input class="input" type="last_name" name="last_name" id="last_name" />

		<label class="label" for="email">Email</label>
		<input class="input" type="email" name="email" id="email" />

		<label class="label" for="password">Password</label>
		<input class="input" type="password" name="password" id="password" />

		{#if form?.error}
			<p class="text-red-500">{form.message}</p>
		{/if}
		<br />
		<button type="submit" class="btn variant-ghost-primary">Submit</button>
	</form>
</section>
