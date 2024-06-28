import { generateIdFromEntropySize } from 'lucia';
import { db } from '../db/db';
import { followers, user } from '../db/schema';
import { and, count, sql } from 'drizzle-orm';

// function to follow a user
export async function followUser(followerId: string, followingId: string) {
	await db.insert(followers).values({
		id: generateIdFromEntropySize(8),
		followerId: followerId,
		followedId: followingId
	});
}

// function to unfollow a user
export async function unfollowUser(followerId: string, followingId: string) {
	await db
		.delete(followers)
		.where(
			and(
				sql`${followers.followerId} = ${followerId}`,
				sql`${followers.followedId} = ${followingId}`
			)
		);
}

// function to get a list of followers and joined to get the user details
export async function getFollowers(userId: string) {
	return db
		.select({
			userId: user.id,
			username: user.username
		})
		.from(followers)
		.innerJoin(user, sql`${followers.followerId} = ${user.id}`)
		.where(sql`${followers.followedId} = ${userId}`);
}

// function to get a list of following
export async function getFollowing(userId: string) {
	return db
		.select({
			followedId: followers.followedId
		})
		.from(followers)
		.where(sql`${followers.followerId} = ${userId}`);
}

// get the count of followers
export async function getFollowersCount(userId: string) {
	const query = await  db
		.select({ followers: count() })
		.from(followers)
		.where(sql`${followers.followedId} = ${userId}`);

    return query[0].followers;
}

// get status is following or not
export async function isFollowing(followerId: string, followedId: string) {
    const query = await db
        .select()
        .from(followers)
        .where(
            and(
                sql`${followers.followerId} = ${followerId}`,
                sql`${followers.followedId} = ${followedId}`
            )
        );

    return query.length > 0;
}
