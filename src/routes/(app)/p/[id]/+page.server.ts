import { usePosts } from '$lib/server/posts/usePosts';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/db';
import { bookmarks, comments, likes, posts, user } from '$lib/server/db/schema';
import { generateIdFromEntropySize } from 'lucia';
import { eq } from 'drizzle-orm';
import { followUser, unfollowUser } from '$lib/server/followers/useFollowers';
import { addBookmark } from '$lib/server/bookmarks/useBookmarks';
import {
	createNotification,
	updateNotificationStatus
} from '$lib/server/notification/useNotification';
import { error } from 'console';

const { getDetailPost } = usePosts;

export const load = (async ({ params, locals, url }) => {
	const detailPost = await getDetailPost(params.id, locals.user?.id);

	const notificationId = url.searchParams.get('notId');

	if (notificationId) {
		await updateNotificationStatus(notificationId);
	}

	await db
		.update(posts)
		.set({
			views: (detailPost.views += 1)
		})
		.where(eq(posts.id, params.id));

	return { posts: detailPost };
}) satisfies PageServerLoad;

export const actions = {
	comment: async (event) => {
		if (!event.locals.user) {
			throw redirect(301, '/signin');
		}

		const { id } = event.params;

		const formData = await event.request.formData();
		const comment = formData.get('comment');
		const userId = formData.get('userIdFromComment');

		if (!userId?.toString()) {
			console.error('Error');
			return;
		}

		try {
			await db.insert(comments).values({
				postId: id,
				userId: event.locals.user.id,
				id: generateIdFromEntropySize(8),
				content: comment?.toString(),
				createdAt: new Date(),
				updatedAt: new Date()
			});

			// create notification
			await createNotification({
				userId: userId.toString(),
				username: event.locals.user.username,
				postId: id,
				type: 'comment'
			});
		} catch (error) {}
	},
	like: async (event) => {
		if (!event.locals.user || !event.locals.user.id) {
			throw redirect(301, '/signin');
		}

		const { id } = event.params;
		const formData = await event.request.formData();
		const isLiked = formData.get('liked');
		const userId = formData.get('userId');

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

			if (!userId?.toString()) {
				console.error('Error');
				return;
			}

			await createNotification({
				username: event.locals.user.username,
				userId: userId.toString(),
				postId: id,
				type: 'like'
			});
		} catch (error) {}
	},
	follow: async (event) => {
		if (!event.locals.user || !event.locals.user.id) {
			throw redirect(301, '/signin');
		}

		const formData = await event.request.formData();
		const isFollowed = formData.get('followed') === 'true'; // Check follow status as boolean
		const userId = formData.get('userId');

		if (!userId) {
			console.error('User ID is missing');
			return;
		}

		try {
			if (isFollowed) {
				await unfollowUser(event.locals.user.id, userId.toString());

				// delete notification
			} else {
				await followUser(event.locals.user.id, userId.toString());

				// Create notification
				await createNotification({
					userId: userId.toString(),
					username: event.locals.user.username,
					type: 'follow'
				});
			}
		} catch (error) {}
	},
	bookmark: async (event) => {
		if (!event.locals.user || !event.locals.user.id) {
			throw redirect(301, '/signin');
		}

		const { id } = event.params;

		if (!id) {
			console.error('Post ID is missing');
			return;
		}

		const formData = await event.request.formData();
		const isBookmarked = formData.get('bookmarked');

		if (!isBookmarked) {
			console.error('Bookmark status is missing');
			return;
		}

		if (isBookmarked == 'true') {
			await db.delete(bookmarks).where(eq(bookmarks.postId, id!));
			return;
		}

		try {
			await addBookmark(event.locals.user.username, id);
		} catch (error) {
			console.error('ERRR', error);
		}
	}
} satisfies Actions;
