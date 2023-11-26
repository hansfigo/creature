<script lang="ts">
	import { modelUpload } from "$lib/state";
	import App from "./components/App.svelte";

    let file : any;

  function handleFileUpload(event : any) {
    file = event.target.files[0];

    console.log(file);

    modelUpload.set(file)
  }
    function submitForm() {
    // Kirim file ke backend atau lakukan tindakan yang sesuai di sini
    console.log(file);
  }

</script>

<div class="bg-gray-800 h-screen">
	<form class="absolute" on:submit|preventDefault={submitForm} enctype="multipart/form-data">
		<input on:change={handleFileUpload} type="file" name="model" />
	</form>
	<App />
</div>
