<script>
	import Footer from '$lib/components/shared/footer.svelte';
	import Navbar from '$lib/components/shared/navbar.svelte';
	import '../app.pcss';

	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';

	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	export let data;

</script>

<div class="bg-main plus-jakarta-sans min-h-screen h-full flex flex-col overflow-x-hidden">
	<Navbar user={data.user} />
	<div class="min-h-full  flex-1">
		<slot />
	</div>
	
	<br><br><br>
	<Footer />
</div>

<style>
	.bg-main {
		background: rgba(14, 2, 49, 1);
	}

	.plus-jakarta-sans {
		font-family: 'Plus Jakarta Sans', sans-serif;
		font-optical-sizing: auto;
		font-weight: 400;
		font-style: normal;
	}
</style>
