<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<section class="flex justify-center items-center w-screen h-screen">
	<form method="POST" use:enhance>
		<label class="label" for="username">Username</label>
		<input class="input" type="text" name="username" id="username" />
		
		<label class="label" for="email">Email</label>
		<input class="input" type="email" name="email" id="email" />

		<label class="label" for="password">Password</label>
		<input class="input" type="password" name="password" id="password" />

		<br />
		<button type="submit" class="btn variant-ghost-primary">Submit</button>
	</form>
</section>
