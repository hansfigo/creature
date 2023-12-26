<script lang="ts">
    import App from "./components/App.svelte";

    export let data
</script>

<div class="bg-gray-800 h-screen">
    <App modelFile={data.url}/>
</div>
