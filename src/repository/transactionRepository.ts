import { knexDb } from '@/common/config';
import { ITransaction } from '@/common/interfaces/transaction';

class TransactionRepository {
	create = async (payload: Partial<ITransaction>) => {
		return await knexDb.table('transactions').insert(payload);
	};
}

export const transactionRepository = new TransactionRepository();
