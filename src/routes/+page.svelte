<script lang="ts">
	import { goto } from '$app/navigation';
	import Navbar from '$lib/components/shared/navbar.svelte';
	import { removeGlbExtension } from '$lib/utils.js';

	export let data;

	console.log(data);

	const models = data.models.map((model: string) => removeGlbExtension(model));
</script>

<Navbar user={data.user} />
<main class="flex h-screen w-screen gap-4 overflow-hidden px-8">
	{#each models as model}
		<button
			on:click={() => goto(`/post/${model}`)}
			class="card btn whitespace-normal h-44 w-44 p-4"
		>
			<p>
				{model}
			</p>
		</button>
	{/each}
</main>
