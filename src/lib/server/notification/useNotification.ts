import { generateIdFromEntropySize } from 'lucia';
import { db } from '../db/db';
import { notifications, user } from '../db/schema';
import { and, eq } from 'drizzle-orm';

type NotificationTemplateParams = {
	type: string;
	username?: string;
	postTitle?: string;
};

function createNotificationTemplate({ type, username, postTitle }: NotificationTemplateParams) {
	let message = '';

	switch (type) {
		case 'like':
			message = `User ${username ?? 'someone'} liked your post: ${postTitle ?? ''}`;
			break;
		case 'comment':
			message = `User ${username ?? 'someone'} commented on your post: ${postTitle ?? ''}`;
			break;
		case 'follow':
			message = `User ${username ?? 'someone'} started following you`;
			break;
		case 'bookmark':
			message = `User ${username ?? 'someone'} bookmarked your post: ${postTitle ?? ''}`;
			break;
		case 'mention':
			message = `User ${username ?? 'someone'} mentioned you in a comment on post: ${postTitle ?? ''}`;
			break;
		default:
			message = 'You have a new notification';
	}

	return message;
}

type NotificationParams = {
	userId: string;
	postTitle?: string;
	username?: string;
	type: string;
};

// Create Notification
export const createNotification = async ({
	userId,
	postTitle,
	username,
	type
}: NotificationParams) => {
	const message = createNotificationTemplate({
		type,
		postTitle: postTitle ? postTitle : undefined,
		username: username ? username : undefined
	});

	await db.insert(notifications).values({
		id: generateIdFromEntropySize(8),
		userId,
		message,
		type: 'info',
		isRead: false,
		createdAt: new Date(),
		updatedAt: new Date()
	});
};

export const getNotifications = async (userId: string) => {
	const userNotifications = await db
		.select()
		.from(notifications)
		.where(eq(notifications.userId, userId));
};

// update status of notification
export const updateNotificationStatus = async (notificationId: string) => {
	await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId));
};

// check if user has unread notifications
export const hasUnreadNotifications = async (userId: string) => {
	const userNotifications = await db
		.select()
		.from(notifications)
		.where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

	return userNotifications.length > 0;
};
