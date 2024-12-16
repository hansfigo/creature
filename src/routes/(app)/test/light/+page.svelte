<script lang="ts">
	import { storage } from '$lib/firebase';
	import { modelUpload } from '$lib/state';
	import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
	import App from './components/App.svelte';

	let file: any;

	function handleFileUpload(event: any) {
		file = event.target.files[0];

		modelUpload.set(file);
	}
	function submitForm() {
		// Kirim file ke backend atau lakukan tindakan yang sesuai di sini
	}
</script>

<div class=" h-screen">
	<App />
</div>
