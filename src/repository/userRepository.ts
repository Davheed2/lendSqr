import { knexDb } from '@/common/config';
import { IUser, WalletBalance } from '@/common/interfaces';
import { AppError, generateUniqueTransactionReference } from '@/common/utils';
import { transactionRepository } from './transactionRepository';

class UserRepository {
	create = async (payload: Partial<IUser>) => {
		return await knexDb.table('users').insert(payload);
	};

	findById = async (id: number): Promise<IUser> => {
		return await knexDb.table('users').where({ id }).first();
	};

	findByUsername = async (username: string) => {
		return await knexDb.table('users').where({ username }).first();
	};

	findByEmail = async (email: string) => {
		return await knexDb.table('users').where({ email }).first();
	};

	update = async (id: number, payload: IUser) => {
		return await knexDb.table('users').where({ id }).update(payload);
	};

	delete = async (id: number) => {
		return await knexDb.table('users').where({ id }).del();
	};

	getBalance = async (id: number): Promise<WalletBalance> => {
		return await knexDb.table('users').where({ id }).select('walletBalance').first();
	};

	getAllUsers = async (): Promise<IUser[]> => {
		return await knexDb.table('users').select('*');
	};

	fundWallet = async (userId: number, validatedAmount: number) => {
		return knexDb.transaction(async (trx) => {
			const user = await trx('users').where({ id: userId }).first();

			if (!user) {
				throw new Error('User not found');
			}

			const currentBalance = parseFloat(user.walletBalance);
			const newBalance = currentBalance + validatedAmount;

			await trx('users').where({ id: userId }).update({ walletBalance: newBalance });

			await trx.commit();

			await transactionRepository.create({
				senderId: userId,
				receiverId: userId,
				amount: validatedAmount,
				transactionType: 'deposit',
				status: 'completed',
				transactionReference: generateUniqueTransactionReference(),
			});
		});
	};

	transferMoneyToUser = async (senderId: number, walletAddress: string, validatedAmount: number) => {
		return knexDb.transaction(async (trx) => {
			const [sender, receiver] = await Promise.all([
				trx('users').where({ id: senderId }).first(),
				trx('users').where({ walletAddress }).first(),
			]);

			if (!sender) {
				throw new AppError('Sender not found', 404);
			}

			if (sender.walletAddress === walletAddress) {
				throw new AppError('Cannot transfer money to your own wallet', 400);
			}

			if (!receiver) {
				throw new AppError('Receiver not found', 404);
			}

			const senderBalance = parseFloat(sender.walletBalance);
			const receiverBalance = parseFloat(receiver.walletBalance);

			if (senderBalance < validatedAmount) {
				throw new AppError('Insufficient balance', 400);
			}

			await trx('users')
				.where({ id: senderId })
				.update({ walletBalance: senderBalance - validatedAmount });
			await trx('users')
				.where({ walletAddress })
				.update({ walletBalance: receiverBalance + validatedAmount });

			await trx.commit();

			await transactionRepository.create({
				senderId: senderId,
				receiverId: receiver.id,
        walletAddress: walletAddress,
				amount: validatedAmount,
				transactionType: 'transfer',
				status: 'completed',
				transactionReference: generateUniqueTransactionReference(),
			});
		});
	};

	updateBalance = async (userId: number, balance: number, amount: number) => {
		return knexDb.transaction(async (trx) => {
			await trx('users')
				.where({ id: userId })
				.update({ walletBalance: balance - amount });
			await trx('users');

			await trx.commit();

			await transactionRepository.create({
				senderId: userId,
				receiverId: userId,
				amount: amount,
				transactionType: 'withdraw',
				status: 'completed',
				transactionReference: generateUniqueTransactionReference(),
			});
		});
	};
}

export const userRepository = new UserRepository();
