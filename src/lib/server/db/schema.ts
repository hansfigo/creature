import { bigint, mysqlTable, varchar, serial, text } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
	id: serial('id').primaryKey(),
	username: varchar('username', { length: 256 }).unique(),
    firstName: varchar('first_name', { length: 256 }),
    lastName: varchar('last_name', { length: 256 }),
	email: varchar('email', { length: 256 }).unique(),
	password: varchar('password', { length: 256 }),
    profilePicture: varchar('profile_picture', { length: 256 }),
});

export const post = mysqlTable('posts', {
    id: serial('id').primaryKey(),
    userId: bigint('user_id', { mode: 'number', unsigned: true }).references(() => user.id),
    title: varchar('title', { length: 256 }),
    description: text('description'),
    createdAt: varchar('created_at', { length: 256 }),
    updatedAt: varchar('updated_at', { length: 256 }),
});

export const models = mysqlTable('models', {
    id: serial('id').primaryKey(),
    userId: bigint('user_id', { mode: 'number', unsigned: true }).references(() => user.id),
    filePath : varchar('file_path', { length: 256 }),
    createdAt: varchar('created_at', { length: 256 }),
    updatedAt: varchar('updated_at', { length: 256 }),
});

export const postTags = mysqlTable('post_tags',{
    id: serial('id').primaryKey(),
    userId: bigint('user_id', { mode: 'number', unsigned: true }).references(() => user.id),
    postId: bigint('post_id', { mode: 'number', unsigned: true }).references(() => post.id),
})

export const tags = mysqlTable('tags', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).unique(),
});

export const likes = mysqlTable('likes', {
    id : serial('id').primaryKey(),
    userId: bigint('user_id', { mode: 'number', unsigned: true }).references(() => user.id),
    postId: bigint('post_id', { mode: 'number', unsigned: true }).references(() => post.id),
});


