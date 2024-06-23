import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { posts, user } from '../db/schema';

const initUser = () => {
	const updateuser = async (username: string, data: any) => {
		const userData = await db.select().from(user).where(eq(user.username, username));
		if (userData.length === 0) {
			return undefined;
		}
		const updatedUser = await db.update(user).set(data).where(eq(user.username, username));
		return updatedUser;
	}
	const getUserDetail = async (username: string) => {
		const userData = await db.select().from(user).where(eq(user.username, username));
		const PostList = await db.select().from(posts).where(eq(posts.userId, userData[0].id));

		if (PostList.length === 0) {
			return undefined;
		}

		let data = {
			user: userData[0],
			posts: PostList as any
		};

		data.posts.forEach((post : any) => {
			post.user = userData[0];
		});

		return data;

	};

	return { getUserDetail };
};

export const userUser = initUser();
