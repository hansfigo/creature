import { useUser } from '$lib/server/user/userUser';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const { getUserDetail } = useUser;
export const load = (async (event) => {
	const { username } = event.params;
	if (!username) {
		return {
			status: 404,
			error: 'User not found'
		};
	}

	const userDetail = await getUserDetail(username);

	if (!userDetail) {
		throw redirect(302, '/');
	}

	const { posts, user } = userDetail;

	const p = event.locals.session ? event.locals.session.userId : null;

	return { posts: posts ? posts : null, locals: event.locals!, user, p };
}) satisfies PageServerLoad;
