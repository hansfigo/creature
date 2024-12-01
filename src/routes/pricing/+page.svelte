<script lang="ts">
	import Container from '$lib/components/shared/container.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Container>
	<h1 class="text-[3.4rem] font-bold mt-20">Find a plan to power your projects</h1>

	<div class="flex gap-4">
		<div class="">
			<h1>Basic</h1>
			<p>for basic usage</p>
			<button> start uploading</button>
		</div>

		<div class="">
			<h1>Pro</h1>
			<p>for profesional 3d artist</p>
			<button> Upgrade now</button>
		</div>
	</div>
</Container>
