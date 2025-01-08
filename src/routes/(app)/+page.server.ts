import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db/db';
import { posts } from '$lib/server/db/schema';
import { model } from '$lib/server/Model';
import { usePosts } from '$lib/server/posts/usePosts';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

const { getPosts, getTopRatedPosts } = usePosts;

export const load: PageServerLoad = async (event) => {
	try {
		const [postList, topRatedPosts] = await Promise.all([
			getPosts(),
			getTopRatedPosts(),
		]);

		// Return hasilnya
		return { postList, topRatedPosts };
	} catch (error) {
		// Tangani error
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
