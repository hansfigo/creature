import { and, asc, count, desc, eq, ilike, inArray, like, or, sql } from 'drizzle-orm';
import { isBookmarked } from '../bookmarks/useBookmarks';
import { db } from '../db/db';
import { comments, likes, posts, postTags, tags, user } from '../db/schema';
import { getFollowersCount, isFollowing } from '../followers/useFollowers';
import { redis } from '../redis';

export enum orderEnum {
	ASC = 'asc',
	DESC = 'desc'
}

interface DetailPost {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	createdAt: Date;
	modelPath: string;
	views: number;
	user: {
		id: string;
		username: string;
		firstName: string;
		lastName: string;
		profilePicture: string;
		followersCount?: number;
		isFollowing?: boolean;
		email: string;
	};
	comments: {
		id: string;
		content: string;
		createdAt: Date;
		user: {
			id: string;
			username: string;
			firstName: string;
			lastName: string;
			profilePicture: string;
		};
	}[];
	likes: number;
	tags: {
		id: string;
		tag: string;
	}[];
	isLiked?: boolean;
	isBookmarked?: boolean;
}

interface GetPostsParams {
	order?: orderEnum;
	query?: string | null;
	tags?: string[];
}

const postInit = () => {
	const getPosts = async ({
		order = orderEnum.ASC,
		query = null,
		tags = []
	}: GetPostsParams = {}) => {

		const cached = await redis.get(`posts:${order}:${query}:${tags.join(',')}`);

		if (cached) {
			return JSON.parse(cached);
		}

		let orderBy = order === orderEnum.ASC ? asc(posts.createdAt) : desc(posts.createdAt);
		const postList = await db
			.selectDistinct({
				id: posts.id,
				title: posts.title,
				description: posts.description,
				thumbnail: posts.thumbnail,
				createdAt: posts.createdAt,
				views: posts.views,
				user: {
					id: user.id,
					username: user.username,
					firstName: user.firstName,
					lastName: user.lastName,
					profilePicture: user.profilePicture
				},
				likes: sql`COUNT(${likes.id})`
			})
			.from(posts)
			.leftJoin(likes, eq(likes.postId, posts.id))
			.leftJoin(postTags, eq(postTags.postId, posts.id))
			.innerJoin(user, eq(user.id, posts.userId))
			.groupBy(
				posts.id,
				posts.title,
				posts.description,
				posts.thumbnail,
				posts.createdAt,
				posts.views,
				user.id,
				user.username,
				user.firstName,
				user.lastName,
				user.profilePicture
			)
			.where(
				and(
					eq(posts.is_published, true),
					query
						? sql<string>`LOWER(${posts.title}) LIKE ${'%' + query.toLowerCase() + '%'}`
						: undefined,
					tags.length > 0 ? inArray(postTags.tagId, tags) : undefined
				)
			)
			.orderBy(orderBy);


		await redis.set(`posts:${order}:${query}:${tags.join(',')}`, JSON.stringify(postList), 'EX', 60 * 60 * 24);
		
		return postList;
	};

	const getDetailPost = async (id: string, userId: string | undefined): Promise<DetailPost> => {
		const post = await db
			.select({
				id: posts.id,
				title: posts.title,
				description: posts.description,
				thumbnail: posts.thumbnail,
				createdAt: posts.createdAt,
				modelPath: posts.model,
				views: posts.views,
				user: {
					id: user.id,
					username: user.username,
					firstName: user.firstName,
					lastName: user.lastName,
					profilePicture: user.profilePicture,
					email : user.email
				}
			})
			.from(posts)
			.innerJoin(user, eq(user.id, posts.userId))
			.where(eq(posts.id, id));
		const tagList = await db
			.select({
				id: tags.id,
				tag: tags.name
			})
			.from(postTags)
			.innerJoin(tags, eq(tags.id, postTags.tagId))
			.where(eq(postTags.postId, id));

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

		//get followers count

		postClone.comments = commentList;
		postClone.likes = likesCount[0].count;
		postClone.tags = tagList;

		let isLiked = null;
		if (userId) {
			isLiked = await db
				.select()
				.from(likes)
				.where(and(eq(likes.postId, id), eq(likes.userId, userId)));
		}

		if (isLiked) {
			postClone.isLiked = isLiked.length > 0;
		}

		const followersCount = await getFollowersCount(postClone.user.id);
		postClone.user.followersCount = followersCount;

		if (userId) {
			const isFollow = await isFollowing(userId, postClone.user.id);
			postClone.user.isFollowing = isFollow;

			// get bookmark status
			const isBookmarkedByuser = await isBookmarked(userId, id);
			postClone.isBookmarked = isBookmarkedByuser;
		} else {
			postClone.user.isFollowing = null;
			postClone.isBookmarked = null;
		}

		return postClone;
	};

	const getTopRatedPosts = async () => {

		const cached = await redis.get('topRatedPosts');

		if (cached) {
			return JSON.parse(cached);
		}

		const PostList = await db
			.select({
				id: posts.id,
				title: posts.title,
				description: posts.description,
				thumbnail: posts.thumbnail,
				createdAt: posts.createdAt,
				views: posts.views,
				likes: sql`COUNT(${likes.id})`,
				rating: sql`(${posts.views} * 0.6 + COUNT(${likes.id}) * 0.4) AS rating`,
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
			.leftJoin(likes, eq(likes.postId, posts.id))
			.groupBy(
				posts.id,
				posts.title,
				posts.description,
				posts.thumbnail,
				posts.createdAt,
				posts.views,
				user.id,
				user.username,
				user.firstName,
				user.lastName,
				user.profilePicture
			)
			.orderBy(sql`rating DESC`) // Urutkan berdasarkan rating
			.limit(6);

		await redis.set('topRatedPosts', JSON.stringify(PostList), 'EX', 60 * 60 * 24);

		return PostList;
	};


	return {
		getPosts,
		getDetailPost,
		getTopRatedPosts
	};
};

export const usePosts = postInit();
