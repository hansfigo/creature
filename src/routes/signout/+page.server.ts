import { authFirebase } from '$lib/firebase';
import { signOut } from 'firebase/auth';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    signOut(authFirebase).then(() => {
        console.log('Berhasil Logout')
    }).catch((err: Error) => {
        console.log('Error Logout : ', err)
    })
    return {};
}) satisfies PageServerLoad;