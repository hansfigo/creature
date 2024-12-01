import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

const host = process.env.NODE_ENV === 'production' ? process.env.DB_HOST : process.env.DB_HOST_DEV;
const user = process.env.NODE_ENV === 'production' ? process.env.DB_USER : process.env.DB_USER_DEV;
const password =
	process.env.NODE_ENV === 'production' ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_DEV;
const database =
	process.env.NODE_ENV === 'production' ? process.env.DB_NAME : process.env.DB_NAME_DEV;
const port = process.env.NODE_ENV === 'production' ? process.env.DB_PORT : process.env.DB_PORT_DEV;
export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dialect: 'mysql', // 'postgresql' | 'mysql' | 'sqlite'
	dbCredentials: {
		host: host || '',
		user: user || '',
		password: password || '',
		database: database || '',
		port: 3306
	}
});
