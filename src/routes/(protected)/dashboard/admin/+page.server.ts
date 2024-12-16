import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		title: 'Admin Dashboard'
	};
}) satisfies PageServerLoad;
