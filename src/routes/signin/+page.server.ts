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
import { eq, SQL, sql } from 'drizzle-orm';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const email = formData.get('email');
		const firstName = formData.get('first_name');
		const lastName = formData.get('last_name');

        console.log("EXCESS", username, password, email, firstName, lastName);
		// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
		// keep in mind some database (e.g. mysql) are case insensitive
		if (
			typeof username !== 'string' ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-z0-9_-]+$/.test(username)
		) {
			return fail(400, {
                error : true,
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
                error : true,
				message: 'Invalid password'
			});
		}

		if (typeof email !== 'string' || email.length < 6 || email.length > 255) {
			return fail(400, {
                error : true,
				message: 'Invalid email'
			});
		}

		if (typeof firstName !== 'string' || firstName.length < 1 || firstName.length > 255) {
			return fail(400, {
                error : true,
				message: 'Invalid first name'
			});
		}

		if (typeof lastName !== 'string' || lastName.length < 1 || lastName.length > 255) {
			return fail(400, {
                error : true,
				message: 'Invalid last name'
			});
		}

		const userId = generateIdFromEntropySize(10); // 16 characters long
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		// TODO: check if username is already used
		const existedUsername = await db
			.select()
			.from(user).where(
                sql`${user.username} = ${username}`
            )

		if (existedUsername.length > 0) {
			return fail(400, {
                error : true,
				message: 'Username already exists'
			});
		}

		await db.insert(user).values({
			id: userId,
			username: username,
			email: email,
			password: passwordHash,
			firstName: firstName,
			lastName: lastName
		});

		const session = await lucia.createSession(userId, {});
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
