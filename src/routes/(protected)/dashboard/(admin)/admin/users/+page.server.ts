import { useUser } from '$lib/server/user/userUser';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const user = await useUser.getUser();

	return {
		user,
		title: 'Users | Admin Dashboard'
	};
}) satisfies PageServerLoad;
