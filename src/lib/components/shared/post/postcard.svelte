<script lang="ts">
	import Icon from '@iconify/svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	export let post;
	export let showOptions = false;

	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'bottom'
	};

	const handleDelete = () => {
		console.log('Delete Post');
	};
</script>

<div class="card p-4 variant-filled-surface z-[99]" data-popup="popupClick">
	<button on:click={handleDelete} class="text-red-500 btn">Delete Post</button>
	<div class="arrow variant-filled-surface" />
</div>
<div class="relative rounded-xl md:rounded-3xl h-[14rem] w-[10rem] md:w-[20rem] md:h-[20rem] border-[1px] border-slate-800 overflow-hidden">
	<a href={`/p/${post.id}`}>
		<img src={post.thumbnail} class="min-w-full min-h-full object-cover z-0" alt={post.title} />
	</a>
	{#if showOptions}
		<button use:popup={popupClick} class="absolute top-4 right-5 text-2xl z-20">
			<Icon icon="ic:sharp-settings"></Icon>
		</button>
	{/if}
	<div
		class="bg-slate-800/40 backdrop-blur-sm min-w-[90%] absolute z-20 bottom-2 md:bottom-6 px-4 py-4 rounded-lg left-1/2 transform -translate-x-1/2"
	>
		<p class="text-white font-bold md:text-xl">{post.title}</p>
		<p class="text-white font-bold text-sm md:text-base">{post.user.username}</p>
	</div>
</div>
