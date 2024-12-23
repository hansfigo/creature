<script lang="ts">
</script>

<div class="grid h-screen gap-5 grid-rows-[auto_1fr_auto] min-w-full">
	<!-- Header -->
	<header class="text-[3rem] pt-8 font-bold p-4">
		<a href="/">CREATURE</a>
	</header>
	<!-- Grid Column -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr_auto]">
		<!-- Sidebar (Left) -->
		<aside class=" p-4">
			<nav>
				<ul class="flex flex-col space-y-2">
					<li class="btn"><a href="/dashboard/admin">Dashboard</a></li>
					<li class="btn"><a href="/dashboard/admin/users">Users</a></li>
					<li class="btn"><a href="/dashboard/admin/transactions">Transactions</a></li>
				</ul>
			</nav>
		</aside>
		<!-- Main -->
		<main class="p-4 space-y-4">
			<slot />
		</main>
	</div>
	<footer class="bg-blue-500 p-4">Creature</footer>
</div>
