import { updateNotificationStatus } from '$lib/server/notification/useNotification';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, url }) => {
	const urlOrigin = url.searchParams.get('from');
	const notificationId = params.id;

	// update notification status
	if (notificationId) {
		await updateNotificationStatus(notificationId);
	}

    // redirect to the original url
    if (urlOrigin) {
        throw redirect(301, urlOrigin);
    }
	return {};
}) satisfies PageServerLoad;
