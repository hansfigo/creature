import { storage } from '$lib/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import type { PageServerLoad } from './$types';

export const load = (async () => {

    const storageRef = ref(storage, `/models/mahiro.glb`);

    const url = await getDownloadURL(storageRef)

    return {
        url: url
    };
}) satisfies PageServerLoad;