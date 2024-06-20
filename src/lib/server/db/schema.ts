import { thumbnail } from '$lib/state';
import {
	mysqlTable,
	varchar,
	text,
	timestamp,
	datetime
} from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
	id: varchar('id', { length: 256 }).primaryKey().notNull(),
	username: varchar('username', { length: 256 }).unique(),
	firstName: varchar('first_name', { length: 256 }),
	lastName: varchar('last_name', { length: 256 }),
	email: varchar('email', { length: 256 }).unique(),
	password: varchar('password', { length: 256 }),
	profilePicture: varchar('profile_picture', { length: 256 }),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});

export const sessionTable = mysqlTable('session', {
	id: varchar('id', { length: 256 }).primaryKey(),
	userId: varchar('user_id', { length: 256 })
		.references(() => user.id)
		.notNull(),
	expiresAt: datetime('expires_at').notNull()
});

export const posts = mysqlTable('posts', {
	id: varchar('id', { length: 256 }).primaryKey(),
	userId: varchar('user_id', { length: 256 })
		.references(() => user.id)
		.notNull(),
	modelId: varchar('model_id', { length: 256 }).references(() => models.id),
	title: varchar('title', { length: 256 }),
	description: text('description'),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at'),
	thumbnail: varchar('thumbnail', { length: 256 })
});

export const models = mysqlTable('models', {
	id: varchar('id', { length: 256 }).primaryKey(),
	userId: varchar('user_id', { length: 256 })
		.references(() => user.id)
		.notNull(),
	filePath: varchar('file_path', { length: 256 }),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});

export const postTags = mysqlTable('post_tags', {
	id: varchar('id', { length: 256 }).primaryKey(),
	userId: varchar('user_id', { length: 256 })
		.references(() => user.id)
		.notNull(),
	postId: varchar('post_id', { length: 256 }).references(() => posts.id),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});

export const tags = mysqlTable('tags', {
	id: varchar('id', { length: 256 }).primaryKey(),
	name: varchar('name', { length: 256 }).unique(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});

export const likes = mysqlTable('likes', {
	id: varchar('id', { length: 256 }).primaryKey(),
	userId: varchar('user_id', { length: 256 })
		.references(() => user.id)
		.notNull(),
	postId: varchar('post_id', { length: 256 }).references(() => posts.id),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});
