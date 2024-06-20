import { useFirebase } from '$lib/firebase';
import { db } from '$lib/server/db/db';
import { models, posts, user } from '$lib/server/db/schema';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { message } from 'sveltekit-superforms';

export const GET: RequestHandler = async () => {
	const x = await db
		.select({
			username: sql<string>`${String('MADOKA')}`
		})
		.from(user);
	return json({ hello: 'mamah', rand: x });
};

export const POST: RequestHandler = async ({ request, locals }) => {

	if (locals.session === undefined) {
		return json({ error: 'Unauthorized' });
	}

	const { title, description, file, thumbnail } = Object.fromEntries(await request.formData());

	if (!title || !file || !thumbnail) {
		return json({ error: 'Invalid input' });
	}

	const fileUrl: string = await useFirebase.uploadFile({
		file: file as File,
		path: '/users/posts/models/'
	});

	const thumbnailUrl : string = await useFirebase.uploadFile({
		file: thumbnail as File,
		path: '/users/posts/thumnails/'
	})

	if (!fileUrl) {
		return json({ error: 'Error uploading file' });
	}

	const userID = locals.session!.userId;
	const modelID = generateIdFromEntropySize(8);

	await db.insert(models).values({
		id: modelID,
		filePath: fileUrl,
		createdAt: new Date(),
		updatedAt: new Date(),
		userId: userID
	});

	await db.insert(posts).values({
		id: generateIdFromEntropySize(8),
		userId: userID,
		title: title.toString(),
		description: description.toString(),
		createdAt: new Date(),
		updatedAt: new Date(),
		modelId: modelID,
		thumbnail : thumbnailUrl
	});
	return json({ hello: 'mamah' });
};
