import { model } from '$lib/server/Model';
import type { PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { usePosts } from '$lib/server/posts/usePosts';

const { getPosts } = usePosts;

export const load: PageServerLoad = async (event) => {
	try {
		const postList = await getPosts();
		console.log(postList);
		return { postList };
	} catch (error) {
		throw error;
	}
};

// const models = await model.getModel();
// return { models: models, user: event.locals.user };
