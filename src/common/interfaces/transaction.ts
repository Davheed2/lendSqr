import { TransactionStatus, TransactionType } from '../types';

export interface ITransaction {
	id: number;
	senderId: number | null;
	receiverId: number | null;
	amount: number;
	walletAddress: string;
	transactionType: TransactionType;
	status: TransactionStatus;
	transactionReference: string;
	created_at?: Date;
	updated_at?: Date;
}
