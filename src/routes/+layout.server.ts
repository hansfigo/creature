import { lucia } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { useUser } from '$lib/server/user/userUser';

export const load = (async (event) => {
	if (event.locals.user === undefined) {
		if (event.locals.session !== null) {
			await lucia.invalidateSession(event.locals.session.id);
			const sessionCookie = lucia.createBlankSessionCookie();
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
		throw redirect(302, '/signin');
	}
	const url = event.request.url;

	if (!event.locals.user) {
		return { user: event.locals.user, url };
	}
	
	const userDetail = await useUser.getUserDetail(event.locals.user?.username);

	return { user: event.locals.user, url, userDetail : userDetail.user };
}) satisfies LayoutServerLoad;
