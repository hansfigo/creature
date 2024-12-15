import { title } from 'process';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/db';
import { useUser } from '$lib/server/user/userUser';

export const load = (async (event) => {
	if (!event.locals.user) {
		return {
			user: null,
			title: 'Pricing'
		};
	}

	try {
		const userData = await useUser.getUserInfo(event.locals.user?.username);

		return {
			user: userData,
			title: 'Pricing'
		};
	} catch (error) {
		console.error(error);
		return {
			user: null,
			title: 'Pricing'
		};
	}
}) satisfies PageServerLoad;
