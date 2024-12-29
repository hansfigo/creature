import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import { invalidateAll } from '$app/navigation';

export const load = (async (event) => {
	if (!event.locals.session) {
		throw redirect(307, '/');
	}
	await lucia.invalidateSession(event.locals.session.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
	throw redirect(307, '/signin/?invalidate=true');
}) satisfies PageServerLoad;
