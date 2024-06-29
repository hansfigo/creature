import { db } from '$lib/server/db/db';
import { posts, postTags } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateIdFromEntropySize } from 'lucia';

export const GET: RequestHandler = async () => {
	return new Response();
};

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	const userID = locals.session!.userId;

	if (!userID) {
		return json({ error: 'Unauthorized' });
	}

	const postID = params.id;

	if (!postID) {
		return json({ error: 'Invalid input' });
	}

	const { title, description, file, thumbnail, tags } = Object.fromEntries(
		await request.formData()
	);

	if (!title) {
		return json({ error: 'Invalid input' });
	}

	const payload: any = {
		title: title.toString(),
		updatedAt: new Date()
	};

	if (description) {
		payload['description'] = description.toString();
	}

	let tagIdList = [];

	if (tags) {
		const taglist = await JSON.parse(tags.toString());
		//return only id keys value
		tagIdList = taglist.map((tag: any) => tag.id);
		payload['tags'] = tagIdList;
	}

	if (thumbnail) {
		payload['thumbnail'] = thumbnail.toString();
	}

	// update data to database
	try {
		await db
			.update(posts)
			.set(payload)
			.where(sql`${posts.id} = ${postID}`);

		try {
			if (tagIdList.length > 0) {
				await db.insert(postTags).values(
					tagIdList.map((tagId: string) => ({
						postId: postID,
						id: generateIdFromEntropySize(8),
						tagId: tagId
					}))
				);
			}
		} catch (error) {
			return json({ error: 'Error updating post tags' });
		}
	} catch (error) {
		return json({ error: 'Error updating post' });
	}

	return json({ success: true, message: 'Post updated' });
};
