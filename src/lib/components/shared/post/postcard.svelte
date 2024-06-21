<script>
	export let post;
</script>

<a
	href={`/p/${post.id}`}
	class="relative rounded-3xl w-[20rem] h-[20rem] border-[1px] border-slate-800 overflow-hidden"
>
	<img src={post.thumbnail} class="min-w-full min-h-full object-cover z-0" alt={post.title} />
	<div
	class="bg-slate-300/40 backdrop-blur-sm min-w-[90%] absolute z-20 bottom-6 px-4 py-4 rounded-lg left-1/2 transform -translate-x-1/2"
	>
		<p class="text-white font-bold text-xl">{post.title}</p>
		<p class="text-white font-bold text-base">{post.title}</p>
	</div>
</a>
