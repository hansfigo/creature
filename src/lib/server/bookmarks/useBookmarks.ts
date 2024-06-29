// get bookmarks list for username

import { and, eq } from 'drizzle-orm';
import { bookmarks, posts, user } from '../db/schema';
import { db } from '../db/db';
import { generateIdFromEntropySize } from 'lucia';

// add bookmarks
export const addBookmark = async (username: string, postId: string) => {
	const userData = await db.select().from(user).where(eq(user.username, username));
	const post = await db.select().from(posts).where(eq(posts.id, postId));
	const bookmark = await db.select().from(bookmarks).where(eq(bookmarks.id, userData[0].id));

	if (bookmark.length === 0 && post.length > 0 && userData.length > 0) {
		await db.insert(bookmarks).values({
			id: generateIdFromEntropySize(8),
			userId: userData[0].id,
			postId: post[0].id,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	} else {
		await db.delete(bookmarks).where(eq(bookmarks.id, userData[0].id));
	}
};

// remove bookmarks
export const removeBookmark = async (username: string, postId: string) => {
	const userData = await db.select().from(user).where(eq(user.username, username));
	const post = await db.select().from(posts).where(eq(posts.id, postId));
	await db
		.delete(bookmarks)
		.where(and(eq(bookmarks.userId, userData[0].id), eq(bookmarks.postId, post[0].id)));
};

export const getBookmarks = async (username: string) => {
	const userData = await db.select().from(user).where(eq(user.username, username));
	const bookmarksList = await db
		.select({
			id: bookmarks.id,
			userId: bookmarks.userId,
			postId: bookmarks.postId,
			createdAt: bookmarks.createdAt,
			updatedAt: bookmarks.updatedAt,
			title: posts.title,
			post: {
				id : posts.id,
				userId: posts.userId,
				createdAt: posts.createdAt,
				updatedAt: posts.updatedAt,
				views: posts.views,
				title : posts.title,
				thumbnail: posts.thumbnail,
			},
			user : {
				username: user.username,
				email: user.email,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			}
		})
		.from(bookmarks)
		.innerJoin(posts, eq(bookmarks.postId, posts.id))
		.innerJoin(user, eq(posts.userId, user.id))
		.where(eq(bookmarks.userId, userData[0].id));
	return bookmarksList;
};

// check if post is bookmarked
export const isBookmarked = async (userId: string, postId: string) => {
	const userData = await db.select().from(user).where(eq(user.id, userId));
	const post = await db.select().from(posts).where(eq(posts.id, postId));
	const bookmark = await db
		.select()
		.from(bookmarks)
		.where(and(eq(bookmarks.userId, userData[0].id), eq(bookmarks.postId, post[0].id)));
	return bookmark.length > 0;
};
