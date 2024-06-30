<script lang="ts">
	import Icon from "@iconify/svelte";

	export let posts;
	let elemMovies: HTMLDivElement;

	function multiColumnLeft(): void {
		let x = elemMovies.scrollWidth;
		if (elemMovies.scrollLeft !== 0) x = elemMovies.scrollLeft - elemMovies.clientWidth;
		elemMovies.scroll(x, 0);
	}

	function multiColumnRight(): void {
		let x = 0;
		// -1 is used because different browsers use different methods to round scrollWidth pixels.
		if (elemMovies.scrollLeft < elemMovies.scrollWidth - elemMovies.clientWidth - 1)
			x = elemMovies.scrollLeft + elemMovies.clientWidth;
		elemMovies.scroll(x, 0);
	}
</script>

<div class="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
	<!-- Button: Left -->
	<button type="button" class="btn-icon variant-outline" on:click={multiColumnLeft}>
        <Icon icon="ic:sharp-arrow-back" />
	</button>
	<!-- Carousel -->
	<div
		bind:this={elemMovies}
		class="snap-x snap-mandatory scroll-smooth flex gap-2 pb-2 overflow-x-auto"
	>
		{#each posts as movie}
			<a href={`/p/${movie.id}`} target="_blank" class="relative shrink-0 w-[28%] md:h-[24rem] snap-start border-[1px] border-slate-800 rounded-3xl">
				<img
					class="rounded-container-token object-cover h-full hover:brightness-125"
					src={movie.thumbnail}
					alt={movie.id}
					title={movie.id}
					loading="lazy"
				/>
                <div class="absolute top-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/60 to-95%">

                </div>
                <div class="absolute bottom-4 left-4">
                    <p class="text-xl font-bold">{movie.title}</p>
                    <p>@{movie.user.username}</p>
                    <div class="flex items-center gap-2 mt-4">
                        <span>👍 {movie.likes}</span>
                        <span>👀 {movie.views}</span>
                    </div>
                </div>
			</a>
		{/each}
	</div>
	<!-- Button-Right -->
	<button type="button" class="btn-icon variant-outline" on:click={multiColumnRight}>
        <Icon icon="ic:sharp-arrow-forward" />
	</button>
</div>
