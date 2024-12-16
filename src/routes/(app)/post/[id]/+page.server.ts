import { storage } from '$lib/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {

    const modelName = params.id

    const storageRef = ref(storage, `/models/${modelName}.glb`);

    const url = await getDownloadURL(storageRef)

    return {
        model: url
    };
}) satisfies PageServerLoad;