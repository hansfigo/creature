import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {

    const res = await fetch('/api/models')

    const models = await res.json()

    return { models : models.fileNames };
}) satisfies PageServerLoad;