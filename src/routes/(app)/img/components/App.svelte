<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';

	export let modelFile : string
</script>

<Canvas>
	<Scene modelFile={modelFile}/>
</Canvas>


