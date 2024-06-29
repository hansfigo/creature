import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { bookmarks, posts, user } from '../db/schema';
import { hasUnreadNotifications } from '../notification/useNotification';

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
	const getUserDetail = async (username: string) => {
		const userData = await db.select().from(user).where(eq(user.username, username));
		const PostList = await db.select().from(posts).where(eq(posts.userId, userData[0].id));

		const bookmarksList = await db.select().from(bookmarks).where(eq(bookmarks.id, userData[0].id));

		// check if user has unread notifications
		const hasUnreadNotif = await hasUnreadNotifications(userData[0].id);

		let data = {
			user: userData[0] as any,
			posts: PostList as any,
			bookmarks: bookmarksList
		};

		data.user = {
			...data.user,
			hasUnreadNotification: hasUnreadNotif
		};
		
		data.posts.forEach((post: any) => {
			post.user = userData[0];
		});

		return data;
	};

	return { getUserDetail, updateuser };
};

export const useUser = initUser();
