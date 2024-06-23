import { desc, eq, or, sql } from 'drizzle-orm';
import { db } from '../db/db';
import { comments, posts, user } from '../db/schema';

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
		const post = await db
			.select({
				id: posts.id,
				title: posts.title,
				description: posts.description,
				thumbnail: posts.thumbnail,
				createdAt: posts.createdAt,
				modelPath: posts.model,
				user: {
					id: user.id,
					username: user.username,
					firstName: user.firstName,
					lastName: user.lastName,
					profilePicture: user.profilePicture
				}
			})
			.from(posts)
			.where(eq(posts.id, id))
			.innerJoin(user, eq(user.id, posts.userId));

		const commentList = await db
			.select({
				id: comments.id,
				content: comments.content,
				createdAt: comments.createdAt,
				user: {
					id: user.id,
					username: user.username,
					firstName: user.firstName,
					lastName: user.lastName,
					profilePicture: user.profilePicture
				}
			})
			.from(comments)
			.where(eq(comments.postId, id))
			.innerJoin(user, eq(user.id, comments.userId))
			.orderBy(desc(comments.createdAt));

		const postClone : any = post[0];

		postClone.comments = commentList;


		return postClone;
	};

	return {
		getPosts,
		getDetailPost
	};
};

export const usePosts = postInit();
