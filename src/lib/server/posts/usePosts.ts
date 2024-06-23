import { and, count, desc, eq, or, sql } from 'drizzle-orm';
import { db } from '../db/db';
import { comments, likes, posts, user } from '../db/schema';

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

	const getDetailPost = async (id: string, userId : string | undefined) => {
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

		const likesCount = await db
			.select({
				count: count()
			})
			.from(likes)
			.where(eq(likes.postId, id));
		
		//check if its Liked or Not

				

		const postClone: any = post[0];

		postClone.comments = commentList;
		postClone.likes = likesCount[0].count;

		let isLiked = null;
		if (userId) {
			isLiked = await db.select().from(likes).where(and(eq(likes.postId, id), eq(likes.userId, userId)));
		}

		if (isLiked) {
			postClone.isLiked = isLiked.length > 0;
		}

		return postClone;
	};

	return {
		getPosts,
		getDetailPost
	};
};

export const usePosts = postInit();
