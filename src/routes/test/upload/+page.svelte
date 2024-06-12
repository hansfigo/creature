<script lang="ts">
	import { storage } from '$lib/firebase';
	import { isLightOn, modelUpload } from '$lib/state';
	import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
	import App from './components/App.svelte';

	let file: any;

	function handleFileUpload(event: any) {
		file = event.target.files[0];

		console.log(file);

		modelUpload.set(file);
		// console.log(spaceRef);
	}
	function submitForm() {
		// Kirim file ke backend atau lakukan tindakan yang sesuai di sini

		console.log(file);
	}

	const handleToggleLight = () => {
		isLightOn.set((!$isLightOn) as boolean);
	};
</script>

<div class=" h-screen">
	<form class="bg absolute" on:submit|preventDefault={submitForm} enctype="multipart/form-data">
		<input on:change={handleFileUpload} type="file" name="model" accept=".glb" />
	</form>
	<div class="absolute z-40 bottom-0 right-[50%]">
		<button on:click={() => handleToggleLight()} class="btn variant-filled-primary">
			{`Lightning ${$isLightOn ? 'On' : 'Off'}`}
		</button>
	</div>
	<App />
</div>
