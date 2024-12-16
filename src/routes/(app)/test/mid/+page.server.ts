import { isRedirect, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createSnapTransactionToken } from '$lib/server/midtrans/midtrans';
import { is } from 'drizzle-orm';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		return { isRedirect: true, redirect: '/signin', title: 'Midtrans Payment' };
	}

	console.log(locals.user.id, 'USER');

	return {
		title: 'Midtrans Payment',
		isRedirect: false,
		user: locals.user
	};
}) satisfies PageServerLoad;

export const actions = {
	premium: async (event) => {
		const res = await createSnapTransactionToken({
			order_id: '123',
			gross_amount: 10000
		});

		console.log(res, 'RES');

		return {
			status: 200,
			body: res
		};
	}
} satisfies Actions;
