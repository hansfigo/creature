import { model } from '$lib/server/Model';
import type { PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { usePosts } from '$lib/server/posts/usePosts';
import { posts } from '$lib/server/db/schema';
import { db } from '$lib/server/db/db';

const { getPosts, getTopRatedPosts } = usePosts;

export const load: PageServerLoad = async (event) => {
	try {
		const postList = await getPosts();

		const x = await db.select().from(posts);

		const topRatedPosts = await getTopRatedPosts();
		return { postList, topRatedPosts };
	} catch (error) {
		throw error;
	}
};

// const models = await model.getModel();
// return { models: models, user: event.locals.user };

export const actions: Actions = {
	search: async (event) => {
		const formData = await event.request.formData();
		const query = formData.get('query');

		return redirect(302, `/search/?${query}`);
	}
};
