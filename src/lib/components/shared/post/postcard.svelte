<script lang="ts">
	import Icon from '@iconify/svelte';
	import { popup } from '@skeletonlabs/skeleton';

	export let post;
	export let showOptions = false;
	export let index = 0;

	console.log(post, 'POST');

	let popupPostCard: any = {
		event: 'click',
		placement: 'bottom'
	};

	const handleDelete = () => {};
</script>

<div class="card p-4 variant-filled z-[99]" data-popup={'popupPostCard-' + post.id}>
	<button on:click={handleDelete} class="btn">
		<span>Archive</span>
	</button>
	<br />
	<a href={`/dashboard/edit/${post.id}`}>
		<button on:click={handleDelete} class="btn">
			<span>Edit</span>
			<Icon icon="ic:sharp-edit"></Icon>
		</button>
	</a>
	<div class="arrow variant-filled-surface" />
</div>
<div
	class="relative rounded-xl md:rounded-3xl h-[18rem] md:w-[20rem] md:h-[20rem] border-[1px] border-slate-800 overflow-hidden"
>
	<a href={`/p/${post.id}`}>
		<img src={post.thumbnail} class="min-w-full min-h-full object-cover z-0" alt={post.title} />
	</a>
	{#if showOptions}
		<button
			use:popup={{ ...popupPostCard, target: `popupPostCard-${post.id}` }}
			class="absolute top-4 right-5 text-2xl z-20"
		>
			<Icon icon="ic:sharp-settings"></Icon>
		</button>
	{/if}
	<div
		class="bg-slate-800/40 backdrop-blur-sm min-w-[90%] absolute z-20 bottom-2 md:bottom-6 px-4 py-4 rounded-lg left-1/2 transform -translate-x-1/2"
	>
		<div>
			<p class="text-white font-bold md:text-xl">{post.title}</p>
			<p class="text-white text-sm md:text-base">@{post.user.username}</p>
		</div>
		<div class="flex gap-2 mt-3">
			<div>
				<div class="flex items-center  md:text-sm text-xs">
					<Icon icon="ic:sharp-favorite"></Icon>
					<span>{post.totalLikes}</span>
				</div>
			</div>
			<div class="flex items-center md:text-sm text-xs">
				<Icon icon="ic:sharp-remove-red-eye"></Icon>
				<span>{post.views}</span>
			</div>
		</div>
	</div>
</div>
