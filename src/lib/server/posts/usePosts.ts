import { desc, eq, or } from 'drizzle-orm';
import { db } from '../db/db';
import { posts, user } from '../db/schema';

export enum orderEnum {
	ASC = 'asc',
	DESC = 'desc'
}

const postInit = () => {
	const getPosts = async (order: orderEnum = orderEnum.ASC) => {
		if (order === orderEnum.ASC) {
			const postList = db
				.select({
					id: posts.id,
					title: posts.title,
					description: posts.description,
					thumbnail: posts.thumbnail,
					createdAt: posts.createdAt,
					user: {
						id: user.id,
						username: user.username,
						firstName: user.firstName,
						lastName: user.lastName,
						profilePicture: user.profilePicture
					}
				})
				.from(posts)
				.innerJoin(user, eq(user.id, posts.userId))
				.orderBy(desc(posts.createdAt));

			return postList;
		} else {
			const postList = await db.select().from(posts).orderBy(desc(posts.createdAt));
			return postList;
		}
	};

	const getDetailPost = async (id: string) => {
		const post = await db.select().from(posts).where(eq(posts.id, id));
		return post[0];
	};

	return {
		getPosts,
		getDetailPost
	};
};

export const usePosts = postInit();
