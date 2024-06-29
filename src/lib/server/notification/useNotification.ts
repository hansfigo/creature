import { generateIdFromEntropySize } from 'lucia';
import { db } from '../db/db';
import { notifications, posts } from '../db/schema';
import { and, eq } from 'drizzle-orm';

type NotificationTemplateParams = {
	type: string;
	username?: string;
	postTitle?: string;
};

function createNotificationTemplate({ type, username }: NotificationTemplateParams) {
	let message = '';

	switch (type) {
		case 'like':
			message = `@${username ?? 'someone'} liked your post: `;
			break;
		case 'comment':
			message = `@${username ?? 'someone'} commented on your post: `;
			break;
		case 'follow':
			message = `@${username ?? 'someone'} started following you`;
			break;
		case 'bookmark':
			message = `@${username ?? 'someone'} bookmarked your post: `;
			break;
		case 'mention':
			message = `@${username ?? 'someone'} mentioned you in a comment on post: `;
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
	postId?: string;
	type: string;
};

// Create Notification
export const createNotification = async ({
	userId,
	postTitle,
	username,
	type,
	postId
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
		type: type,
		isRead: false,
		postId: postId ? postId : null,
		createdAt: new Date(),
		updatedAt: new Date()
	});
};

export const getNotifications = async (userId: string) => {
	const userNotifications = await db
		.select({
			id: notifications.id,
			message: notifications.message,
			isRead: notifications.isRead,
			createdAt: notifications.createdAt,
			postId: notifications.postId,
		})
		.from(notifications)
		.where(eq(notifications.userId, userId))
		.$dynamic();

	if (userNotifications.length === 0) {
		return [];
	}

	// loop through notifications and check if it has postId
	// if it has postId, get the post details
	// else return the notification

	const notificationClone = [...userNotifications] as any;
	for (let i = 0; i < userNotifications.length; i++) {
		if (userNotifications[i].postId) {
			const post = await db.select().from(posts).where(eq(posts.id, userNotifications[i].postId!));
			notificationClone[i].post = post[0];
		}
	}

	return notificationClone;
};

// update status of notification
export const updateNotificationStatus = async (notificationId: string) => {
	await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId));
};

//delete notification
export const deleteNotification = async (notificationId: string) => {
	await db.delete(notifications).where(eq(notifications.id, notificationId));
};

// check if user has unread notifications
export const hasUnreadNotifications = async (userId: string) => {
	const userNotifications = await db
		.select()
		.from(notifications)
		.where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

	return userNotifications.length > 0;
};
