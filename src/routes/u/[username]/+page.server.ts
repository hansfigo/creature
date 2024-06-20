import { userUser } from '$lib/server/user/userUser';
import type { PageServerLoad } from './$types';

const { getUserDetail } = userUser;
export const load = (async ({ params, locals }) => {
	const { username } = params;
	const userDetail = await getUserDetail(username);

	if (!userDetail) {
		return {
			status: 404,
			error: 'User not found'
		};
	}

	return { userDetail, user: locals.user };
}) satisfies PageServerLoad;
