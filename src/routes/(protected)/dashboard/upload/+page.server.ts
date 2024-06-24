import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { useFirebase } from '$lib/firebase';
import { db } from '$lib/server/db/db';
import { generateIdFromEntropySize } from 'lucia';
import { posts, tags, user } from '$lib/server/db/schema';

const schema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	file: z.instanceof(File),
	thumbnail: z.instanceof(File)
});

export const load = (async () => {
	const form = await superValidate(zod(schema));

	const tagsList = await db
		.select({
			id: tags.id,
			name: tags.name
		})
		.from(tags);

	return { form, tags : tagsList };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		if (event.locals.session) {
			const form = await superValidate(event.request, zod(schema));

			if (!form.valid) {
				return fail(400, { form });
			}

			try {
				const fileUrl: string = await useFirebase.uploadFile({
					file: form.data.file as File,
					path: '/users/posts/models/'
				});

				if (!fileUrl) {
					return message(form, 'Error uploading file');
				}

				const userID = event.locals.session.userId;

				const postID = generateIdFromEntropySize(8);

				const thumbnail = form.data.thumbnail as File;
				const thumbnailName = `thumnail_${postID}.png`;

				const thumbnailUrl: string = await useFirebase.uploadFile({
					file: new File([thumbnail], thumbnailName, { type: thumbnail.type }),
					path: '/users/posts/thumnails/'
				});

				if (!thumbnailUrl) {
					return message(form, 'Error uploading file');
				}

				if (!userID) {
					return message(form, 'Error posting form');
				}

				const payload = {
					id: postID,
					userId: userID,
					title: form.data.title,
					model: fileUrl,
					thumbnail: thumbnailUrl,
					description: form.data.description,
					createdAt: new Date(),
					updatedAt: new Date()
				};

				// await db.insert(posts).values(payload);

				return message(form, 'Form posted successfully!');
			} catch (error) {
				console.log(error, 'ERROR');
				return message(form, 'Error posting form');
			}
		}
	}
};
