import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { count } from 'console';
import { link } from 'fs';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { useUser, type userSchema } from '$lib/server/user/userUser';
import { useFirebase } from '$lib/firebase';
import { desc } from 'drizzle-orm';

// const schema = z.object({
// 	firstName: z.string().optional(),
// 	lastName: z.string().optional(),
// 	company: z.string().optional(),
// 	headline: z.string().optional(),
// 	location: z.string().optional(),
// 	country: z.string().optional(),
// 	linkedin: z.string().optional(),
// 	instagram: z.string().optional(),
// 	behance: z.string().optional(),
// 	other: z.string().optional(),
// 	image: z.instanceof(File).optional()
// });

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}
	const userData = await useUser.getUserDetail(locals.user?.username);

	if (!userData) {
		throw redirect(302, '/');
	}

	console.log(userData.user.firstName, 'userData');

	// create zod schema with default value user data
	const schema = z.object({
		firstName: z
			.string()
			.optional()
			.default(userData.user.firstName ?? ''),
		lastName: z
			.string()
			.optional()
			.default(userData.user.lastName ?? ''),
            description: z
			.string()
			.optional()
			.default(userData.user.description ?? ''),
		company: z
			.string()
			.optional()
			.default(userData.user.company ?? ''),
		headline: z
			.string()
			.optional()
			.default(userData.user.headline ?? ''),
		location: z
			.string()
			.optional()
			.default(userData.user.location ?? ''),
		country: z
			.string()
			.optional()
			.default(userData.user.country ?? ''),
		linkedin: z
			.string()
			.optional()
			.default(userData.user.linkedin ?? ''),
		instagram: z
			.string()
			.optional()
			.default(userData.user.instagram ?? ''),
		behance: z
			.string()
			.optional()
			.default(userData.user.behance ?? ''),
		other: z
			.string()
			.optional()
			.default(userData.user.other ?? ''),
		photoProfile: z.instanceof(File).optional()
	});

	const form = await superValidate(zod(schema));

	return { form, user: locals.user, photoProfile: userData.user.profilePicture };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, params }) => {
		const schema = z.object({
			firstName: z.string().optional(),
			lastName: z.string().optional(),
            description: z.string().optional(),
			company: z.string().optional(),
			headline: z.string().optional(),
			location: z.string().optional(),
			country: z.string().optional(),
			linkedin: z.string().optional(),
			instagram: z.string().optional(),
			behance: z.string().optional(),
			other: z.string().optional(),
			photoProfile: z.instanceof(File).optional()
		});

		const form = await superValidate(request, zod(schema));

		console.log('FORM INI', form.data);
		if (!form.valid) {
			return fail(400, { form });
		}

		const payload: userSchema = {
			firstName: form.data.firstName,
			lastName: form.data.lastName,
            description: form.data.description, 
			company: form.data.company,
			headline: form.data.headline,
			location: form.data.location,
			country: form.data.country,
			linkedin: form.data.linkedin,
			instagram: form.data.instagram,
			behance: form.data.behance,
			other: form.data.other
		};

		//check if all payload is undefined or null
		if (Object.values(payload).every((val) => val === undefined || val === null || val === '')) {
			return message(form, 'Invalid input');
		}

		if (form.data.photoProfile) {
			const photoProfile = await useFirebase.uploadFile({
				file: form.data.photoProfile as File,
				path: '/users/profilePictures/'
			});

			if (photoProfile === undefined) {
				return message(form, 'Error uploading file');
			}

			payload.profilePicture = photoProfile;
		}

		if (!params.username) {
			return message(form, 'User not found');
		}

		console.log('PAYLOAD', payload);
		await useUser.updateuser(params.username, payload);

		return message(form, 'You have uploaded a valid file!');
	}
};
