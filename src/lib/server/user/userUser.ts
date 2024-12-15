import { eq, sql } from 'drizzle-orm';
import { db } from '../db/db';
import { bookmarks, likes, posts, user } from '../db/schema';
import { getNotifications, hasUnreadNotifications } from '../notification/useNotification';

export interface userSchema {
	username?: string;
	firstName?: string;
	lastName?: string;
	description?: string;
	company?: string;
	headline?: string;
	location?: string;
	country?: string;
	linkedin?: string;
	instagram?: string;
	behance?: string;
	other?: string;
	profilePicture?: string;
	active_plan?: 'premium' | 'standart' | 'basic';
}

const initUser = () => {
	const updateuser = async (username: string, data: userSchema) => {
		const userData = await db.select().from(user).where(eq(user.username, username));
		if (userData.length === 0) {
			return undefined;
		}
		const updatedUser = await db.update(user).set(data).where(eq(user.username, username));
		return updatedUser;
	};
	const getUserInfo = async (username: string) => {
		const userData = await db.select().from(user).where(eq(user.username, username));
		return userData[0];
	};
	const getUserDetail = async (username: string) => {
		const userData = await db.select().from(user).where(eq(user.username, username));
		const PostList = await db
			.select({
				id: posts.id,
				title: posts.title,
				description: posts.description,
				thumbnail: posts.thumbnail,
				createdAt: posts.createdAt,
				views: posts.views,
				likes: sql`COUNT(${likes.id})`
			})
			.from(posts)
			.leftJoin(likes, eq(likes.postId, posts.id))
			.groupBy(
				posts.id,
				posts.title,
				posts.description,
				posts.thumbnail,
				posts.createdAt,
				posts.views
			)
			.where(eq(posts.userId, userData[0].id));

		const bookmarksList = await db.select().from(bookmarks).where(eq(bookmarks.id, userData[0].id));

		// check if user has unread notifications
		const hasUnreadNotif = await hasUnreadNotifications(userData[0].id);

		//get notifications
		const notifications = await getNotifications(userData[0].id);

		let data = {
			user: userData[0] as any,
			posts: PostList as any,
			bookmarks: bookmarksList
		};

		data.user = {
			...data.user,
			hasUnreadNotification: hasUnreadNotif
		};

		// add notifications to user data
		data.user.notifications = notifications;

		data.posts.forEach((post: any) => {
			post.user = userData[0];
		});

		return data;
	};

	return { getUserDetail, updateuser, getUserInfo };
};

export const useUser = initUser();
