import {
	mysqlTable,
	varchar,
	text,
	timestamp,
	datetime,
	bigint,
	boolean
} from 'drizzle-orm/mysql-core';

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
	company : varchar('company', { length: 256 }),
	other: varchar('other', { length: 256 }),
	country: varchar('country', { length: 256 }),
	password: varchar('password', { length: 256 }),
	description: text('description'),
	bannerPicture: varchar('banner_picture', { length: 256 }),
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
	views: bigint('views', { mode: 'number' }).default(0),
	is_published: boolean('is_published').default(true)
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

export const followers = mysqlTable('followers', {
	id: varchar('id', { length: 256 }).primaryKey(),
	followerId: varchar('follower_id', { length: 256 })
		.references(() => user.id)
		.notNull(),
	followedId: varchar('followed_id', { length: 256 })
		.references(() => user.id)
		.notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});

export const bookmarks = mysqlTable('bookmarks', {
	id: varchar('id', { length: 256 }).primaryKey().notNull(),
	userId: varchar('user_id', { length: 256 })
		.references(() => user.id)
		.notNull(),
	postId: varchar('post_id', { length: 256 })
		.references(() => posts.id)
		.notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const notifications = mysqlTable('notifications', {
	id: varchar('id', { length: 256 }).primaryKey().notNull(),
	userId: varchar('user_id', { length: 256 })
		.references(() => user.id)
		.notNull(),
	type: varchar('type', { length: 256 }).notNull(), // Misalnya: 'like', 'comment', 'follow', dll.
	postId: varchar('post_id', { length: 256 }).references(() => posts.id),
	message: text('message').notNull(),
	isRead: boolean('is_read').default(false),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});