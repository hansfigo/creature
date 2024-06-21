<script lang="ts">
	import { storage } from '$lib/firebase';
	import { modelUpload } from '$lib/state';
	import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
	import App from './components/App.svelte';

	let file: any;

	function handleFileUpload(event: any) {
		file = event.target.files[0];

		// console.log(spaceRef);
	}
	function submitForm() {
		// Kirim file ke backend atau lakukan tindakan yang sesuai di sini
	}
</script>

<div class="bg-gray-800 h-screen">
	<form class="absolute" on:submit|preventDefault={submitForm} enctype="multipart/form-data">
		<input on:change={handleFileUpload} type="file" name="model" accept=".glb"/>
	</form>
	<App />
</div>
