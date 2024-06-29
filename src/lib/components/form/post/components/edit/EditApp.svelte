<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { isModelLoading } from '$lib/state';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import EditScene from './EditScene.svelte';

	export let modelFile: string;
</script>

{#if $isModelLoading}
	<div class="absolute top-0 flex justify-center items-center bottom-0 right-0 left-0 m-auto">
		<ProgressRadial />
	</div>
{/if}

<Canvas
	rendererParameters={{
		antialias: true,
		preserveDrawingBuffer: true
	}}
>
	<EditScene {modelFile} />
</Canvas>
