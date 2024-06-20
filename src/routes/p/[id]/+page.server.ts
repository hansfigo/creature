import { usePosts } from '$lib/server/posts/usePosts';
import type { PageServerLoad } from './$types';

const { getDetailPost } = usePosts;

export const load = (async ({ params }) => {
	const detailPost = await getDetailPost(params.id);

	return detailPost;
}) satisfies PageServerLoad;
