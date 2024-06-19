<script>
	import { enhance } from "$app/forms";

	export let user;
</script>

<div class="flex min-w-full justify-between px-8 mb-12 py-8">
	<h3 class="h3 font-bold">I LOP MB SALLY</h3>

	<p></p>
	{#if user}
		<p>WELLCUM {user.username}</p>
		<form method="post" use:enhance>
			<button>Logout</button>
		</form>
	{:else}
		<div class="flex gap-2">
			<button>
				<a href="/signin"> Login </a>
			</button>
			<button>
				<a href="/signup"> Register </a>
			</button>
		</div>
	{/if}
</div>
