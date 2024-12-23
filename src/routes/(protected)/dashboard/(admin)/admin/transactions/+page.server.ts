import { db } from '$lib/server/db/db';
import { transactions as TransTable } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const transactions = await db.select().from(TransTable);
	return {
		transactions,
		title: 'Transactions | Admin Dashboard'
	};
}) satisfies PageServerLoad;
