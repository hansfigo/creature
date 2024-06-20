<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex min-w-full min-h-full  justify-center items-center">
	<div class="container w-full h-full">
		<h1 class="text-center text-4xl font-bold">{$page.status}: {$page.error?.message}</h1>
	</div>
</div>
