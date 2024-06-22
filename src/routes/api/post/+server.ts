import { useFirebase } from '$lib/firebase';
import { db } from '$lib/server/db/db';
import { posts, user } from '$lib/server/db/schema';
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

	const userID = locals.session!.userId;
	const postID = generateIdFromEntropySize(8);

	const thumbnailName = `thumnail_${postID}.png`;

	const thumbnailUrl: string = await useFirebase.uploadFile({
		file: new File([thumbnail as File], thumbnailName, { type: (thumbnail as File).type }),
		path: '/users/posts/thumnails/'
	});

	let fileUrl: string;

	if (typeof file === 'string') {
		fileUrl = file;
	} else if (file instanceof File) {
		fileUrl = await useFirebase.uploadFile({
			file: file as File,
			path: '/users/posts/models/'
		});
	} else{
		return json({ error: 'Error uploading file' });
	}
 
	if (!fileUrl) {
		return json({ error: 'Error uploading file' });
	}

	await db.insert(posts).values({
		id: postID,
		userId: userID,
		title: title.toString(),
		description: description.toString(),
		createdAt: new Date(),
		updatedAt: new Date(),
		thumbnail: thumbnailUrl,
		model: fileUrl
	});
	return json({ hello: 'mamah' });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (locals.session === undefined) {
		return json({ error: 'Unauthorized' });
	}

	const postID = params.postID;
	const userID = locals.session!.userId;

	const post = await db
		.select({
			id: posts.id,
			userId: posts.userId,
			model: posts.model,
			thumbnail: posts.thumbnail
		})
		.from(posts)
		.where(sql`${posts.id} = ${postID}`);

	if (post.length === 0) {
		return json({ error: 'Post not found' });
	}

	if (post[0].userId !== userID) {
		return json({ error: 'Unauthorized' });
	}

	if (!post[0].model || !post[0].thumbnail) {
		return json({ error: 'Invalid post' });
	}

	const modelFileName = extractFileName(post[0].model);
	const thumbnailFileName = extractFileName(post[0].thumbnail);

	const modelDelete = await useFirebase.deleteFile(`/users/posts/models/${modelFileName}`);

	if (!modelDelete.success) {
		return json({ error: 'Error deleting file' });
	}

	const thumbnailDelete = await useFirebase.deleteFile(
		`/users/posts/thumbnails/${thumbnailFileName}`
	);

	if (!thumbnailDelete.success) {
		return json({ error: 'Error deleting file' });
	}

	await db.delete(posts).where(sql`${posts.id} = ${postID}`);
	return json({ message: 'Post deleted' });
};
