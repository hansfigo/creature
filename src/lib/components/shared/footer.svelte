<script>
	import { TITLE } from '$lib/consants';
</script>

<div class="flex w-full justify-center h-[10rem] md:h-[20rem] ">
	<footer class="container overflow-hidden rounded-t-[4rem] relative">
		<img class="min-h-full min-w-full object-cover opacity-50" src="/footer-bg.svg" alt="" />
		<div class="absolute bottom-0 min-w-full min-h-full py-10 flex px-10 md:px-16 mb-4">
			<div class="w-full">
				<div class="flex justify-between items-center w-full">
					<a href="/" class="h3 font-bold font-jakarta text-2xl text-center w-full md:text-left md:text-4xl">{TITLE}</a>
				</div>
				<div class="w-full h-full flex flex-col gap-2 md:gap-6 justify-end items-center">
					<div class="min-w-full h-[0.15rem] bg-white" />
					<div class="text-center">
						<p>Best 3D Web on Google</p>
						<p>{`@${new Date().getFullYear()} ${TITLE} Team`}</p>
					</div>
				</div>
			</div>
		</div>
	</footer>
</div>
