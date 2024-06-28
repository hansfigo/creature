import { usePosts } from '$lib/server/posts/usePosts';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	const query = url.searchParams.get('query');

    if (!query) {
        return { query };
    }

    // search posts
    const posts = await usePosts.getPosts({
        query
    });

	return {query, posts};
}) satisfies PageServerLoad;
