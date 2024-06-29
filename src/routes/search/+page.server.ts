import { usePosts } from '$lib/server/posts/usePosts';
import { getTagDetail } from '$lib/server/tag/useTag';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	const query = url.searchParams.get('query');
	const tags = url.searchParams.get('tags') ?? '';

	if (!query && !tags) {
		return { query };
	}

	let searchParam: any = {};

	if (query) {
		searchParam = { ...searchParam, query };
	}

	const tagsDetail = await getTagDetail(tags);

	if (tags) {
		searchParam = { ...searchParam, tags: [tagsDetail.id] };
	}

	// search posts
	const posts = await usePosts.getPosts(searchParam);

	return { query, posts, tags };
}) satisfies PageServerLoad;
