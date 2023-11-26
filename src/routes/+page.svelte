<script lang="ts">
	import App from '$lib/components/App.svelte';
	import { modelFile } from '$lib/state';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';


	const popupClick: PopupSettings = {
	event: 'click',
	target: 'popupClick',
	placement: 'top'
};
</script>




<div class="flex h-screen w-screen overflow-hidden">
	<!-- <div class="bg-blue-300 w-54">
		<h1>Halo Bang</h1>
	</div> -->

	<div class="card p-4 variant-filled-primary flex-col" data-popup="popupClick">
		<button class="btn" on:click={()=> modelFile.set('girl_1.glb') }>Model 1</button>
		<button class="btn" on:click={()=> modelFile.set('girl_2.glb') }>Model 2</button>
		<button class="btn" on:click={()=> modelFile.set('girl_3.glb') }>Model 3</button>
		<button class="btn" on:click={()=> modelFile.set('girl_4.glb') }>Model 4</button>
		<button class="btn" on:click={()=> modelFile.set('girl_5.glb') }>Model 5</button>
		<button class="btn" on:click={()=> modelFile.set('tv.glb') }>Model 6</button>
	</div>

	<div class="flex-1 bg-gray-800">
		<button use:popup={popupClick} class="absolute z-30 btn-sm btn text-xs variant-filled-primary top-4 right-4 text-white"
			>Change Model</button
		>
		<App />
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
	}
</style>
