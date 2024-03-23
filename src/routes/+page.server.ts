import { model } from '$lib/server/Model';
import type { PageServerLoad } from './$types';

export const load = (async () => {

    try {
        const models = await model.getModel()
        
        return { models: models };
    } catch (error) {
        throw error
    }

}) satisfies PageServerLoad;