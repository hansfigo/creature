import { db } from '$lib/server/db/db';
import { transactions } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function POST({ request }: { request: Request }) {
	try {
		const body = await request.json();
		const { id, userId, midtransId, transaction_type, amount, status, valid_until } = body;

		await db.insert(transactions).values({
			id,
			userId,
			midtransId,
			transaction_type,
			amount,
			status,
			valid_until
		});

		return json({ message: 'Transaction created successfully!' }, { status: 201 });
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to create transaction.' }, { status: 500 });
	}
}

export async function GET() {
	try {
		const allTransactions = await db.select().from(transactions);
		return json(allTransactions, { status: 200 });
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to fetch transactions.' }, { status: 500 });
	}
}

// UPDATE: Update transaksi berdasarkan ID
export async function PUT({ request }: { request: Request }) {
	try {
		const body = await request.json();
		const { id, ...updateData } = body;

		await db.update(transactions).set(updateData).where(eq(transactions.id, id));
		return json({ message: 'Transaction updated successfully!' }, { status: 200 });
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to update transaction.' }, { status: 500 });
	}
}

// DELETE: Hapus transaksi berdasarkan ID
export async function DELETE({ request }: { request: Request }) {
	try {
		const body = await request.json();
		const { id } = body;

		await db.delete(transactions).where(eq(transactions.id, id));
		return json({ message: 'Transaction deleted successfully!' }, { status: 200 });
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to delete transaction.' }, { status: 500 });
	}
}
