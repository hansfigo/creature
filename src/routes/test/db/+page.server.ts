import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const post = await prisma.post.findMany()
    return { post: post };
}) satisfies PageServerLoad;