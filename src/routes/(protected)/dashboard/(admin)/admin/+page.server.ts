import { db } from '$lib/server/db/db';
import { posts, user } from '$lib/server/db/schema';
import { count } from 'drizzle-orm';
import type { PageServerLoad } from '../../$types';

export const load = (async () => {
	const totalPost = await db.select({ count: count() }).from(posts);
	const totalUser = await db.select({ count: count() }).from(user);
	return {
		totalPost: totalPost[0].count,
		totalUser: totalUser[0].count,
		title: 'Admin Dashboard'
	};
}) satisfies PageServerLoad;
