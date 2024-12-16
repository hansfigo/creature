<script lang="ts">
	import { goto } from '$app/navigation';
	import Container from '$lib/components/shared/container.svelte';
	import { generateIdFromEntropySize } from 'lucia';
	import type { PageData } from './$types';

	export let data: PageData;

	const plans = [
		{
			name: 'Starter',
			description: 'Designed for beginners and hobbyists to explore and share their 3D creations.',
			features: [
				{ name: 'Max file size per upload', value: '30MB' },
				{ name: 'Max posts allowed', value: '8' },
				{ name: 'Access to basic analytics for uploaded models' }
			],
			price: 'Free',
			cta: data.user ? 'Get Started' : 'Start Uploading'
		},
		{
			name: 'Creator',
			description: 'For intermediate 3D artists',
			features: [
				{ name: 'Max file size per upload', value: '60MB' },
				{ name: 'Max posts allowed', value: '12' },
				{ name: 'Access to basic analytics for uploaded models' }
			],
			price: 'IDR 25.000/month',
			cta: data.user ? (data.user.active_plan === 'standart' ? 'Renew' : 'Upgrade') : 'Get Started'
		},
		{
			name: 'Pro',
			description: 'For professional 3D artists',
			features: [
				{ name: 'Max file size per upload', value: '100MB' },
				{ name: 'Max posts allowed', value: '20' },
				{ name: 'Access to advanced analytics for uploaded models' }
			],
			price: 'IDR 50.000/month',
			cta: 'Coming Soon'
		}
	];

	const getToken = async () => {
		const res = await fetch('/api/midtrans/snap/token', {
			method: 'POST',
			body: JSON.stringify({
				gross_amount: 25000
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const data = await res.json();
		return data;
	};

	const createTransaction = async (midtransId: string) => {
		if (!data.user) {
			return;
		}

		await fetch('/api/transaction', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: generateIdFromEntropySize(8),
				userId: data.user.id,
				midtransId,
				transaction_type: 'premium',
				status: 'pending',
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				amount: 25000
			})
		});
	};

	const handleClickCta = async (plan: string) => {
		if (plan === 'Basic') {
			// Redirect to the upload page
			if (!data.user) {
				goto('/login');
				return;
			}

			goto('/dashboard/upload');
		} else if (plan === 'Standard') {
			if (!data.user) {
				goto('/login');
				return;
			}

			if (data.user.active_plan === 'standart') {
				goto('/dashboard/upload');
			} else {
				try {
					const data = await getToken();

					console.log(data, 'ERRRO');

					if (!data) {
						console.log(data, 'ERRRO');
						return;
					}

					const midtransId = data.midtransId;
					const token = data.token;
					await createTransaction(midtransId);

					window.snap.pay(token);
				} catch (error) {
					console.error(error);
					return;
				}
			}
		} else if (plan === 'Premium') {
			// Show a modal that says "Coming Soon"
		}
	};
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<script
		type="text/javascript"
		src="https://app.sandbox.midtrans.com/snap/snap.js"
		data-client-key="SB-Mid-client-LBEEplFcxmj2EqVd"
	></script>
</svelte:head>

<Container>
	<h1 class="text-[3.4rem] font-bold mt-20">Find a plan to power your projects</h1>

	<div class="flex gap-4 mt-44">
		{#each plans as plan}
			<div class="card l flex-1 variant-ghost-surface shadow-lg px-5 py-4">
				<h1 class="font-bold text-2xl mb-2">{plan.name}</h1>
				<p class="text-lg">
					{plan.description}
				</p>
				<ul class="list-disc pl-5 mb-4 mt-2">
					{#each plan.features as feature}
						<li class="text-lg">
							{feature.name}
							{#if feature.value}
								- {feature.value}
							{/if}
						</li>
					{/each}
				</ul>
				<div class="flex items-center mb-4">
					<span class="font-semibold text-xl"> {plan.price} </span>
				</div>
				<button
					on:click={() => {
						handleClickCta(plan.name);
					}}
					class="btn variant-filled-secondary w-full">{plan.cta}</button
				>
			</div>
		{/each}
	</div>
</Container>
