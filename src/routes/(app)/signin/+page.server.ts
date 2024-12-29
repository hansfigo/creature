import { authFirebase } from '$lib/firebase';
import { hashPassword } from '$lib/server/hashPassword';
import { signInWithEmailAndPassword } from 'firebase/auth';
import type { Actions, PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { generateIdFromEntropySize } from 'lucia';
import { hash } from '@node-rs/argon2';
import { db } from '$lib/server/db/db';
import { user } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import { verify } from '@node-rs/argon2';
import { error } from 'console';

export const load = (async (event) => {
	const param = event.url.searchParams.get('invalidate');
	return {
		param
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (password === null || username === null) {
			return fail(400, {
				error: true,
				message: 'Invalid username or password'
			});
		}

		const queryUser = await db
			.select()
			.from(user)
			.where(sql`${user.username} = ${username}`);

		if (queryUser.length == 0) {
			return fail(400, { error: true, message: 'User not found' });
		}

		const existingUser = queryUser[0];

		const validPassword = await verify(existingUser.password!, String(password), {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, {
				error: true,
				message: 'Incorrect username or password'
			});
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		throw redirect(302, '/');
	}
};

// export const actions = {
//     default: async ({ request }) => {
//         const data = await request.formData();
//         const email = data.get('email')!;
//         const password = data.get('password')!;

//         const hashedPassword = await hashPassword(password.toString())

//         signInWithEmailAndPassword(authFirebase, email.toString(), hashedPassword)
//             .then(async () => {
//                 throw redirect(300, '/')
//             })
//             .catch((error) => {
//                 console.error('Error saat membuat akun:', error);
//             })
//     },
// } satisfies Actions;
