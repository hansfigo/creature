<script lang="ts">
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';

	import { storePopup } from '@skeletonlabs/skeleton';
	import '../app.pcss';

	import { inject } from '@vercel/analytics';

	inject({ mode: 'production' });

	initializeStores();

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<slot />
