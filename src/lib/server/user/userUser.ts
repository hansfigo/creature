import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { user } from '../db/schema';

const initUser = () => {
	const getUserDetail = async (username: string) => {
		const userData = await db.select().from(user).where(eq(user.username, username));

		if (userData.length === 0) {
			return undefined;
		}

		return userData[0];
	};

	return { getUserDetail };
};

export const userUser = initUser();
