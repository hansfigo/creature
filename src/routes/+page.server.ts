import { model } from '$lib/server/Model';
import type { PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { usePosts } from '$lib/server/posts/usePosts';

const { getPosts } = usePosts;

export const load: PageServerLoad = async (event) => {
	try {
		const postList = await getPosts();
		return { postList: postList };
	} catch (error) {
		throw error;
	}
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		throw redirect(302, '/signin');
	}
};

// const models = await model.getModel();
// return { models: models, user: event.locals.user };
