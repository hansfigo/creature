<script lang="ts">
	import Cropper from 'svelte-easy-crop';
	export let crop = { x: 0, y: 0 };
	export let zoom = 4;

    export let image;
    export let onCropComplete = () => {};
    export let classList = ''

    console.log(image, "PPPPP");
</script>

<div class={`relative ${classList}`}>
	<Cropper image={image} bind:crop bind:zoom on:cropcomplete={onCropComplete} />
</div>
