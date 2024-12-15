import midtransClient from 'midtrans-client';
import { MIDTRANS_SERVER_KEY } from '$env/static/private';

interface TransactionPayload {
	order_id: string;
	gross_amount: number;
}

export const createTransaction = async (payload: TransactionPayload) => {
	try {
		const { order_id, gross_amount } = payload;

		const snap = new midtransClient.Snap({
			isProduction: false,
			serverKey: MIDTRANS_SERVER_KEY || ''
		});

		const transactionParams = {
			transaction_details: {
				order_id: order_id,
				gross_amount: gross_amount
			},
			credit_card: {
				secure: true
			}
		};

		const transaction = await snap.createTransaction(transactionParams);
		return transaction;
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		} else {
			console.error('Unknown error occurred');
		}
	}
};

export const createSnapTransactionToken = async (payload: TransactionPayload) => {
	try {
		const { order_id, gross_amount } = payload;

		const snap = new midtransClient.Snap({
			isProduction: false,
			serverKey: MIDTRANS_SERVER_KEY || ''
		});

		const transactionParams = {
			transaction_details: {
				order_id: order_id,
				gross_amount: gross_amount
			},
			credit_card: {
				secure: true
			}
		};

		const token = await snap.createTransactionToken(transactionParams);
		console.log(token);
		return token;
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		} else {
			console.error('Unknown error occurred');
		}
	}
};
