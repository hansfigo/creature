import { storage } from '$lib/firebase';
import type { RequestHandler } from '@sveltejs/kit';
import { listAll, ref } from 'firebase/storage';

export const GET: RequestHandler = async () => {
    const listRef = ref(storage, `/models`);

    try {
        const res = await listAll(listRef);
        const fileNames = res.items.map((itemRef) => itemRef.name);

        return new Response(JSON.stringify({ fileNames }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};