import { getBookmarks } from '$lib/server/bookmarks/useBookmarks';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const bookmarksList = await getBookmarks(event.params.username);

	return { bookmarks: bookmarksList };
}) satisfies PageServerLoad;
