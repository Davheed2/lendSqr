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
	//emailVerificationToken?: string;
	isSuspended: boolean;
	isEmailVerified: boolean;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}
