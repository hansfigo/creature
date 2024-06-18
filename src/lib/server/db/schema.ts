import { bigint, mysqlTable, varchar, serial, text, timestamp } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
	id: serial('id').primaryKey(),
	username: varchar('username', { length: 256 }).unique(),
    firstName: varchar('first_name', { length: 256 }),
    lastName: varchar('last_name', { length: 256 }),
	email: varchar('email', { length: 256 }).unique(),
	password: varchar('password', { length: 256 }),
    profilePicture: varchar('profile_picture', { length: 256 }),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
});

export const post = mysqlTable('posts', {
    id: serial('id').primaryKey(),
    userId: bigint('user_id', { mode: 'number', unsigned: true }).references(() => user.id),
    modelsId: bigint('models_id', { mode: 'number', unsigned: true }).references(() => models.id),
    title: varchar('title', { length: 256 }),
    description: text('description'),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
});

export const models = mysqlTable('models', {
    id: serial('id').primaryKey(),
    userId: bigint('user_id', { mode: 'number', unsigned: true }).references(() => user.id),
    filePath : varchar('file_path', { length: 256 }),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
});

export const postTags = mysqlTable('post_tags',{
    id: serial('id').primaryKey(),
    userId: bigint('user_id', { mode: 'number', unsigned: true }).references(() => user.id),
    postId: bigint('post_id', { mode: 'number', unsigned: true }).references(() => post.id),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
})

export const tags = mysqlTable('tags', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).unique(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),

});

export const likes = mysqlTable('likes', {
    id : serial('id').primaryKey(),
    userId: bigint('user_id', { mode: 'number', unsigned: true }).references(() => user.id),
    postId: bigint('post_id', { mode: 'number', unsigned: true }).references(() => post.id),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
});


