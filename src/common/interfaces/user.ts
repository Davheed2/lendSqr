import { Role } from '../constants';

export interface IUser {
	id: number;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	phoneNumber: string;
	password: string;
	role: Role;
	ipAddress: string;
	isSuspended: boolean;
	walletAddress: string;
	walletBalance: number;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}
