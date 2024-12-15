<script lang="ts">
	import { goto } from '$app/navigation';
	import Container from '$lib/components/shared/container.svelte';
	import { generateIdFromEntropySize } from 'lucia';
	import type { PageData } from './$types';

	export let data: PageData;

	const createTransaction = async (midtransId: string) => {
		if (data.user === undefined) {
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
				amount: 50000
			})
		});
	};

	const getToken = async () => {
		const res = await fetch('/api/midtrans/snap/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const data = await res.json();
		return data;
	};

	const handlePay = async () => {
		if (data.isRedirect) {
			goto(data.redirect!);

			return;
		}

		console.log(data.user, 'USER');

		try {
			const data = await getToken();

			const midtransId = data.midtransId;
			const token = data.token;
			await createTransaction(midtransId);

			window.snap.pay(token);
		} catch (error) {
			console.error(error);
			return;
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
	<h1>{data.title}</h1>

	<br />
	<br />

	<button
		on:click={() => {
			handlePay();
		}}
		class="btn variant-outline-secondary">Pay</button
	>
</Container>
