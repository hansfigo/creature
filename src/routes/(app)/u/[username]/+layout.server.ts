import { useUser } from '$lib/server/user/userUser';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, params }) => {

 

    const userDetail = await useUser.getUserDetail(params.username);

    return { userDetail: userDetail.user, user: locals.user };
}) satisfies LayoutServerLoad;