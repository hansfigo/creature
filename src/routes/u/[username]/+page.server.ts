import { userUser } from '$lib/server/user/userUser';
import type { PageServerLoad } from './$types';

const { getUserDetail } = userUser;
export const load = (async (event) => {
	const { username } = event.params;
	const userDetail = await getUserDetail(username);

	if (!userDetail) {
		return {
			status: 404,
			error: 'User not found'
		};
	}

	const {posts, user} = userDetail


	const p = event.locals.session ? event.locals.session.userId : null;

	return { posts, locals : event.locals, user, p};
}) satisfies PageServerLoad;
