<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
</script>

<Canvas
	rendererParameters={{
		antialias: true,
		preserveDrawingBuffer: true
	}}
>
	<Scene />
</Canvas>
