<script lang="ts">
	import { goto } from '$app/navigation';
	import { removeGlbExtension } from '$lib/utils.js';

	export let data;

	const models = data.models.map((model: string) => removeGlbExtension(model));
</script>

<header class="px-8 mb-12">
	<h1 class="h3 font-bold">3D NII BOSS</h1>
</header>
<main class="flex h-screen w-screen gap-4 overflow-hidden px-8">
	{#each models as model}
		<button on:click={()=>goto(`/post/${model}`)} class="card btn whitespace-normal h-44 w-44 p-4">
			<p>
				{model}
			</p>
		</button>
	{/each}
</main>

