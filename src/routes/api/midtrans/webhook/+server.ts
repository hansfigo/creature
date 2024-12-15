import type { RequestHandler } from '@sveltejs/kit';
import midtransClient from 'midtrans-client';

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Parsing JSON body dari request
		const { notification } = await request.json();

		// Inisialisasi CoreApi dari Midtrans untuk memverifikasi notifikasi
		const coreApi = new midtransClient.CoreApi({
			isProduction: false,
			serverKey: process.env.MIDTRANS_SERVER_KEY || ''
		});

		// Verifikasi status transaksi menggunakan notifikasi yang diterima
		const transactionStatus = await coreApi.transaction.notification(notification);

		const { order_id, transaction_status } = transactionStatus;

		console.log(`Webhook received for order_id: ${order_id}, status: ${transaction_status}`);

		// Proses lebih lanjut sesuai status transaksi
		if (transaction_status === 'SUCCESS') {
			// Lakukan sesuatu jika transaksi sukses, misalnya update database
		} else if (transaction_status === 'PENDING') {
			// Lakukan sesuatu jika transaksi pending
		} else if (transaction_status === 'FAILED') {
			// Lakukan sesuatu jika transaksi gagal
		}

		// Kirim respons sukses ke Midtrans
		return new Response(JSON.stringify({ message: 'Notification processed successfully' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error processing webhook:', error);

		// Kirim respons error ke Midtrans jika terjadi kesalahan
		return new Response(JSON.stringify({ error: 'Failed to process webhook' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
