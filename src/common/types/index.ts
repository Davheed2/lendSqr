import { IUser } from '../interfaces';

export type AuthenticateResult = {
	currentUser: IUser;
};
export type TransactionType = 'deposit' | 'withdraw' | 'transfer';
export type TransactionStatus = 'pending' | 'completed' | 'failed';
