import { useUser } from '$lib/server/user/userUser';
import type { LayoutServerLoad } from './$types';

export const load = (async ({locals, params}) => {
    
    const userDetail = await useUser.getUserDetail(params.username);

    return { userDetail : userDetail.user, user : locals.user};
}) satisfies LayoutServerLoad;