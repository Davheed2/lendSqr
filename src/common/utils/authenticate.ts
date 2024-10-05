import jwt from 'jsonwebtoken';
import { ENVIRONMENT } from '@/common/config';
import AppError from './appError';
import { userRepository } from '@/repository/userRepository';
import { AuthenticateResult } from '../types';

export const authenticate = async (accessToken: string): Promise<AuthenticateResult> => {
	try {
		const decoded = jwt.verify(accessToken, ENVIRONMENT.JWT.AUTH_SECRET) as jwt.JwtPayload;

		const currentUser = await userRepository.findById(decoded.id);
		if (!currentUser) {
			throw new AppError('User not found', 404);
		}

		if (currentUser.isSuspended) {
			throw new AppError('Your account is currently suspended', 403);
		}

		if (currentUser.isDeleted) {
			throw new AppError('Your account has been deleted', 404);
		}

		return { currentUser };
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
			throw new AppError('Invalid or expired token', 401);
		} else {
			throw new AppError('An error occurred during authentication', 500);
		}
	}
};
