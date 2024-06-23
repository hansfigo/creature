import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import { DrizzleMySQLAdapter } from '@lucia-auth/adapter-drizzle';

dotenv.config();

const host = process.env.NODE_ENV === 'production' ? process.env.DB_HOST : process.env.DB_HOST_DEV;
const user = process.env.NODE_ENV === 'production' ? process.env.DB_USER : process.env.DB_USER_DEV;
const password =
	process.env.NODE_ENV === 'production' ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_DEV;
const database =
	process.env.NODE_ENV === 'production' ? process.env.DB_NAME : process.env.DB_NAME_DEV;

export const connection = mysql.createPool({
	host: host,
	user: user,
	password: password,
	database: database,
	multipleStatements: true,

	ssl: {
		rejectUnauthorized: false
		// ca: fs.readFileSync('/path/to/ca-cert.pem'), // Sertifikat CA jika diperlukan
	}
});

export const db = drizzle(connection, { schema, mode: 'default' });

export const adapter = new DrizzleMySQLAdapter(db, schema.sessionTable, schema.user);
