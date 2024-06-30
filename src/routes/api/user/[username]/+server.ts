import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { useFirebase } from '$lib/firebase';

export const PUT: RequestHandler = async ({ request, locals, params }) => {
	if (locals.session === undefined && locals.user === undefined) {
		return json({ error: 'Unauthorized' });
	}

	const userId = await db
		.select({
			id: user.id
		})
		.from(user)
		.where(eq(user.username, locals.user!.username));

	if (userId.length === 0) {
		return json({ error: 'User not found' });
	}

	if (userId[0].id !== locals.session!.userId && locals.user!.username !== params.username) {
		return json({ error: 'Unauthorized' });
	}

	const formData = Object.fromEntries(await request.formData());

	let data = {};

	if (formData.profilePicture) {
		// check if the file is an image or string
		if (typeof formData.profilePicture === 'string') {
			data = {
				...data,
				profilePicture: formData.profilePicture
			};
		} else {
			try {
				const profilePicture = await useFirebase.uploadFile({
					file: formData.profilePicture as File,
					path: '/users/profilePictures/'
				});
				data = {
					...data,
					profilePicture
				};
			} catch (error) {
				return json({ error: 'Error uploading file' });
			}
		}
	}

	if (formData.bannerPicture) {
		// check if the file is an image or string
		if (typeof formData.bannerPicture === 'string') {
			data = {
				...data,
				bannerPicture: formData.bannerPicture
			};
		} else {
			try {
				const bannerPicture = await useFirebase.uploadFile({
					file: formData.bannerPicture as File,
					path: '/users/bannerPictures/'
				});
				data = {
					...data,
					bannerPicture
				};
			} catch (error) {
				return json({ error: 'Error uploading file' });
			}
		}
	}

	if (formData.firstName) {
		data = {
			...data,
			firstName: formData.firstName
		};
	}

	if (formData.lastName) {
		data = {
			...data,
			lastName: formData.lastName
		};
	}

	if (Object.keys(data).length === 0) {
		return json({ error: 'Invalid input' });
	}

	const updatedUser = await db
		.update(user)
		.set(data)
		.where(eq(user.username, locals.user!.username));

	return json({ message: 'User updated', user: updatedUser[0] });
};
