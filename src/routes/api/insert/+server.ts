import { db } from '$lib/server/db/db';
import { tags } from '$lib/server/db/schema';
import { generateIdFromEntropySize } from 'lucia';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const x = true;
	return json({ message: 'Tags inserted' });
	const tagsList = [
		'3d',
		'model',
		'animation',
		'lighting',
		'rendering',
		'Human',
		'Animal',
		'Nature',
		'Building',
		'Vehicle',
		'Furniture',
		'Electronics',
		'Food',
		'Clothing',
		'Accessories',
		'Tools'
	];

	const tagData = tagsList.map((tag) => ({
		id: generateIdFromEntropySize(8),
		name: tag,
		createdAt: new Date(),
		updatedAt: new Date()
	}));

	await db.insert(tags).values(tagData);
	return json({ message: 'Tags inserted' });
};
