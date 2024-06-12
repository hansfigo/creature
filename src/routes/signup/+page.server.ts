import { hashPassword } from '$lib/server/hashPassword';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import type { PageServerLoad } from './$types';
export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

import { authFirebase } from '$lib/firebase';
import { prisma } from '$lib/server/prisma';
import type { Actions } from './$types';

export const actions = {

    default: async ({ request }) => {
        const data = await request.formData();
        const username = data.get('username')!;
        const email = data.get('email')!;
        const password = data.get('password')!;

        console.log(password);

        const hashedPassword = await hashPassword(password.toString())


        createUserWithEmailAndPassword(authFirebase, email.toString(), hashedPassword)
            .then(async () => {
                const currentUser = authFirebase.currentUser;

                if (currentUser) {
                    await updateProfile(currentUser, {
                        displayName: username.toString()
                    });

                    // Simpan pengguna ke database PostgreSQL menggunakan Prisma
                    await prisma.user.create({
                        data: {
                            uid: currentUser.uid,
                            email: email.toString(),
                            displayName: username.toString(),
                            password: hashedPassword
                        }
                    });

                    console.log('Pengguna berhasil ditambahkan ke Firebase dan PostgreSQL.');
                }
            })
            .catch((error) => {
                console.error('Error saat membuat akun:', error);
            })
    },
} satisfies Actions;