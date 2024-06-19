import { db } from '$lib/server/db/db';
import { models, posts, user } from '$lib/server/db/schema';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	const x = await db
		.select({
			username: sql<string>`${String('MADOKA')}`
		})
		.from(user);
	return json({ hello: 'mamah', rand: x });
};

export const POST: RequestHandler = async ({ request }) => {
	const { title, description, file } = Object.fromEntries(await request.formData());

	if (!title || !description || !file) {
		return json({ error: 'Invalid input' });
	}

	// const insertModel =  await db.insert(models).values({ id : 'ZNDX' , filePath : '/', createdAt : new Date(), updatedAt : new Date()})

	// const modelId = insertModel[0].insertId
	// await db.insert(posts).values({ title : String(title),  description: String(description), modelsId : modelId, createdAt : new Date(), updatedAt : new Date()})
	return json({ hello: 'mamah' });
};
