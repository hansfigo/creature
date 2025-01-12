import { getBookmarks } from '$lib/server/bookmarks/useBookmarks';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {

	if (!event.locals.user) {
		throw redirect(302, '/');
	}

	const bookmarksList = await getBookmarks(event.params.username);

	return { bookmarks: bookmarksList };
}) satisfies PageServerLoad;
