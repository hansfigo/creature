import { createSnapTransactionToken, createTransaction } from '$lib/server/midtrans/midtrans';
import type { RequestHandler } from '@sveltejs/kit';
import { generateIdFromEntropySize } from 'lucia';

export const POST: RequestHandler = async ({ request }) => {
	// get body from request
	const body = await request.json();
	const { gross_amount } = body;

	if (!gross_amount) {
		return new Response(JSON.stringify({ error: 'gross_amount is required' }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	const orderId = `PREMIUM-${generateIdFromEntropySize(4)}`;

	const res = await createTransaction({
		order_id: orderId,
		gross_amount
	});

	// return data = res + orderId
	return new Response(JSON.stringify({ ...res, midtransId: orderId }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
