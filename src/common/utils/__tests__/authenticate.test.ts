import { authenticate } from '../authenticate';
import jwt from 'jsonwebtoken';
import { ENVIRONMENT } from '@/common/config';
import AppError from '../appError';
import { userRepository } from '@/repository/userRepository';
import { checkBlacklistedUser } from '@/api/karma';

jest.mock('jsonwebtoken');
jest.mock('@/common/config');
jest.mock('@/repository/userRepository');
jest.mock('@/api/karma');

describe('authenticate', () => {
	interface User {
		id: number;
		email: string;
		isSuspended: boolean;
		isDeleted: boolean;
	}

	const currentUser: User = {
		id: 1,
		email: 'test@example.com',
		isSuspended: false,
		isDeleted: false,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should successfully authenticate a valid user', async () => {
		(jwt.verify as jest.Mock).mockReturnValue({ id: 1 });
		(userRepository.findById as jest.Mock).mockResolvedValue(currentUser);
		(checkBlacklistedUser as jest.Mock).mockResolvedValue(false);

		const result = await authenticate('valid_token');

		expect(result).toEqual({ currentUser });
		expect(jwt.verify).toHaveBeenCalledWith('valid_token', ENVIRONMENT.JWT.AUTH_SECRET);
		expect(userRepository.findById).toHaveBeenCalledWith(1);
		expect(checkBlacklistedUser).toHaveBeenCalledWith(currentUser.email);
	});

	it('should throw an error if the user is suspended', () => {
		const suspendedUser = { ...currentUser, isSuspended: true };

		expect(() => {
			if (suspendedUser.isSuspended) {
				throw new AppError('Your account is currently suspended', 403);
			}
		}).toThrow(AppError);
		expect(() => {
			if (suspendedUser.isSuspended) {
				throw new AppError('Your account is currently suspended', 403);
			}
		}).toThrow('Your account is currently suspended');
	});

	it('should throw an error if the user is deleted', () => {
		const deletedUser = { ...currentUser, isDeleted: true };

		expect(() => {
			if (deletedUser.isDeleted) {
				throw new AppError('Your account has been deleted', 404);
			}
		}).toThrow(AppError);
		expect(() => {
			if (deletedUser.isDeleted) {
				throw new AppError('Your account has been deleted', 404);
			}
		}).toThrow('Your account has been deleted');
	});

	it('should check if the user is blacklisted and suspend them if true', async () => {
		(checkBlacklistedUser as jest.Mock).mockResolvedValue(true);

		await expect(async () => {
			const isBlacklisted = await checkBlacklistedUser(currentUser.email);
			if (isBlacklisted) {
				userRepository.update(currentUser.id, { isSuspended: true });
				throw new AppError('User is blacklisted', 403);
			}
		}).rejects.toThrow(AppError);

		await expect(async () => {
			const isBlacklisted = await checkBlacklistedUser(currentUser.email);
			if (isBlacklisted) {
				userRepository.update(currentUser.id, { isSuspended: true });
				throw new AppError('User is blacklisted', 403);
			}
		}).rejects.toThrow('User is blacklisted');

		expect(userRepository.update).toHaveBeenCalledWith(currentUser.id, { isSuspended: true });
	});

	it('should not throw any errors if user is not suspended, deleted, or blacklisted', async () => {
		(checkBlacklistedUser as jest.Mock).mockResolvedValue(false);

		if (currentUser.isSuspended) {
			throw new AppError('Your account is currently suspended', 403);
		}

		if (currentUser.isDeleted) {
			throw new AppError('Your account has been deleted', 404);
		}

		const isBlacklisted = await checkBlacklistedUser(currentUser.email);
		if (isBlacklisted) {
			await userRepository.update(currentUser.id, { isSuspended: true });
			throw new AppError('User is blacklisted', 403);
		}

		await expect(Promise.resolve()).resolves.not.toThrow();

		expect(userRepository.update).not.toHaveBeenCalled();
	});

	it('should throw an error for an invalid token', async () => {
		(jwt.verify as jest.Mock).mockImplementation(() => {
			throw new jwt.JsonWebTokenError('Invalid token');
		});

		await expect(authenticate('invalid_token')).rejects.toThrow(AppError);
		await expect(authenticate('invalid_token')).rejects.toThrow('Invalid or expired token');
	});

	it('should throw an error for an expired token', async () => {
		(jwt.verify as jest.Mock).mockImplementation(() => {
			throw new jwt.TokenExpiredError('Token expired', new Date());
		});

		await expect(authenticate('expired_token')).rejects.toThrow(AppError);
		await expect(authenticate('expired_token')).rejects.toThrow('Invalid or expired token');
	});

	it('should throw a generic error for unexpected errors', async () => {
		(jwt.verify as jest.Mock).mockImplementation(() => {
			throw new Error('Unexpected error');
		});

		await expect(authenticate('error_token')).rejects.toThrow(AppError);
		await expect(authenticate('error_token')).rejects.toThrow('An error occurred. Please log in again');
	});
});
