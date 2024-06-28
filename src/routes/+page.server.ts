import { model } from '$lib/server/Model';
import type { PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { usePosts } from '$lib/server/posts/usePosts';

const { getPosts } = usePosts;

export const load: PageServerLoad = async (event) => {
	try {
		const postList = await getPosts();
		return { postList };
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
