import { usePosts } from '$lib/server/posts/usePosts';
import { getTagDetail, getTagList } from '$lib/server/tag/useTag';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	const query = url.searchParams.get('query');
	const tags = url.searchParams.get('tags') ?? '';

	// get tag list
	const tagList = await getTagList();

	if (tagList.length === 0) {
		return { query, tags, tagList: [] };
	}

	if (!query && !tags) {
		const posts = await usePosts.getPosts();
		return { posts, query, tagList };
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
	const posts = await usePosts.getPosts(searchParam ? searchParam : undefined);

	return { query, posts, tags, tagList };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const query = formData.get('query')?.toString();

		throw redirect(302, `/search?query=${query}`);
	}
} satisfies Actions;
