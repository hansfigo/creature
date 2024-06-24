import { usePosts } from '$lib/server/posts/usePosts';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/db';
import { comments, likes, posts } from '$lib/server/db/schema';
import { generateIdFromEntropySize } from 'lucia';
import { eq } from 'drizzle-orm';

const { getDetailPost } = usePosts;

export const load = (async ({ params, locals }) => {
	const detailPost = await getDetailPost(params.id, locals.user?.id);

	await db
		.update(posts)
		.set({
			views: (detailPost.views += 1)
		})
		.where(eq(posts.id, params.id));
		
	return detailPost;
}) satisfies PageServerLoad;

export const actions = {
	comment: async (event) => {
		if (!event.locals.user) {
			throw redirect(301, '/signin');
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
	},
	like: async (event) => {
		if (!event.locals.user || !event.locals.user.id) {
			throw redirect(301, '/signin');
		}

		const { id } = event.params;
		const formData = await event.request.formData();
		const isLiked = formData.get('liked');

		if (isLiked == 'true') {
			await db.delete(likes).where(eq(likes.postId, id!));
			return;
		}

		try {
			await db.insert(likes).values({
				id: generateIdFromEntropySize(8),
				userId: event.locals.user.id,
				postId: id,
				createdAt: new Date(),
				updatedAt: new Date()
			});
		} catch (error) {
			console.log(error);
		}
	}
} satisfies Actions;
