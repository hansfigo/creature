import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import { DrizzleMySQLAdapter } from '@lucia-auth/adapter-drizzle';

import dotenv from 'dotenv';
dotenv.config();

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

export const connection = mysql.createPool({
	host: host,
	user: user,
	password: password,
	database: database,
	multipleStatements: true,

	ssl: {
		rejectUnauthorized: false
	}
});

export const db = drizzle(connection, { schema, mode: 'default' });

export const adapter = new DrizzleMySQLAdapter(db, schema.sessionTable, schema.user);
