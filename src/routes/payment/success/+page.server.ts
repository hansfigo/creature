import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/db';
import { transactions, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = (async ({ url, locals }) => {
	if (locals.user == null) {
		throw redirect(302, '/login');
	}

	const orderID = url.searchParams.get('order_id');
	const status = url.searchParams.get('status_code');
	const transactionStatus = url.searchParams.get('transaction_status');

	try {
		if (orderID) {
			await db
				.update(transactions)
				.set({ status: `success` })
				.where(eq(transactions.midtransId, orderID));

			// update user active_plan
			await db.update(user).set({ active_plan: `premium` }).where(eq(user.id, locals.user.id));
		} else {
			throw new Error('Order ID is null');
		}
	} catch (error) {
		console.error(error);
	}

	return {
		title: 'Payment Success'
	};
}) satisfies PageServerLoad;
