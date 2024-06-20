import { desc, eq, or } from 'drizzle-orm';
import { db } from '../db/db';
import { models, posts } from '../db/schema';

export enum orderEnum {
	ASC = 'asc',
	DESC = 'desc'
}

const postInit = () => {
	const getPosts = async (order: orderEnum = orderEnum.ASC) => {
		if (order === orderEnum.ASC) {
			const postList = await db.select().from(posts).orderBy(posts.createdAt);
			return postList;
		} else {
			const postList = await db.select().from(posts).orderBy(desc(posts.createdAt));
			return postList;
		}
	};

	const getDetailPost = async (id: string) => {
		const post =  db.select().from(posts).where(eq(posts.id, id)).as('ps');
		const model = await db.select().from(models).innerJoin(posts, eq(posts.modelId, models.id));
		return model[0];
	};

	return {
		getPosts,
		getDetailPost
	};
};

export const usePosts = postInit();
