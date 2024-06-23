import { usePosts } from '$lib/server/posts/usePosts';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/db';
import { comments } from '$lib/server/db/schema';
import { generateIdFromEntropySize } from 'lucia';

const { getDetailPost } = usePosts;

export const load = (async ({ params }) => {
	const detailPost = await getDetailPost(params.id);
	console.log("====================================");
	console.log(params.id, "ID");
	console.log("====================================");
	console.log(detailPost, "PPPP");

	return detailPost;
}) satisfies PageServerLoad;

export const actions = {
	comment: async (event) => {
		if (!event.locals.user) {
			throw new Error('Unauthorized');
		}

		const { id } = event.params;

		const formData = await event.request.formData();
		const comment = formData.get('comment');

		try {
			await db.insert(comments).values({
				postId: id,
				userId: event.locals.user.id,
				id: generateIdFromEntropySize(8),
				content: comment?.toString(),
				createdAt: new Date(),
				updatedAt: new Date()
			});
		} catch (error) {
			console.log(error);
		}
	}
} satisfies Actions;
