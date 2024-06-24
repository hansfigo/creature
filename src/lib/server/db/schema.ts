import { mysqlTable, varchar, text, timestamp, datetime, bigint } from 'drizzle-orm/mysql-core';
import { link } from 'fs';

export const user = mysqlTable('user', {
	id: varchar('id', { length: 256 }).primaryKey().notNull(),
	username: varchar('username', { length: 256 }).unique(),
	firstName: varchar('first_name', { length: 256 }),
	location: varchar('location', { length: 256 }),
	instagram: varchar('instagram', { length: 256 }),
	linkedin: varchar('linkedin', { length: 256 }),
	behance: varchar('behance', { length: 256 }),
	headline: varchar('headline', { length: 256 }),
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
	title: varchar('title', { length: 256 }),
	model: varchar('model_path', { length: 256 }),
	description: text('description'),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at'),
	thumbnail: varchar('thumbnail', { length: 256 }),
	views: bigint('views', { mode: 'number' }).default(0)
});

export const postTags = mysqlTable('post_tags', {
	id: varchar('id', { length: 256 }).primaryKey(),
	postId: varchar('post_id', { length: 256 }).references(() => posts.id),
	tagId: varchar('tag_id', { length: 256 }).references(() => tags.id),
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

export const comments = mysqlTable('comments', {
	id: varchar('id', { length: 256 }).primaryKey(),
	userId: varchar('user_id', { length: 256 })
		.references(() => user.id)
		.notNull(),
	postId: varchar('post_id', { length: 256 }).references(() => posts.id),
	content: text('content'),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});
