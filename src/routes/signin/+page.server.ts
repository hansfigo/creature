import { authFirebase } from '$lib/firebase';
import { hashPassword } from '$lib/server/hashPassword';
import { redirect } from '@sveltejs/kit';
import { signInWithEmailAndPassword } from 'firebase/auth';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const email = data.get('email')!;
        const password = data.get('password')!;

        const hashedPassword = await hashPassword(password.toString())

        signInWithEmailAndPassword(authFirebase, email.toString(), hashedPassword)
            .then(async () => {
                throw redirect(300, '/')
            })
            .catch((error) => {
                console.error('Error saat membuat akun:', error);
            })
    },
} satisfies Actions;