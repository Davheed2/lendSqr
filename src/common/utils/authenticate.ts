import jwt from 'jsonwebtoken';
import { ENVIRONMENT } from '@/common/config';
import AppError from './appError';
import { userRepository } from '@/repository/userRepository';
import { AuthenticateResult } from '../types';
//import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authenticate = async (accessToken: string): Promise<AuthenticateResult> => {
	try {
		const decoded = jwt.verify(accessToken, ENVIRONMENT.JWT.AUTH_SECRET) as jwt.JwtPayload;

		const currentUser = await userRepository.findById(decoded.id.user);
		if (!currentUser) {
			throw new AppError('User not found', 404);
		}

		if (currentUser.isSuspended) {
			throw new AppError('Your account is currently suspended', 403);
		}

		if (currentUser.isDeleted) {
			throw new AppError('Your account has been deleted', 404);
		}

		// const identity = currentUser.email;

		// const { data } = await axios.get(`https://adjutor.lendsqr.com/v2/verification/karma/${identity}`, {
		// 	headers: {
		// 		Authorization: `Bearer ${ENVIRONMENT.ADJUTOR_TOKEN.TOKEN}`,
		// 		'Content-Type': 'application/json',
		// 	},
		// });

		// console.log(data)
		// if (data.status === 404) {

		// 	// Process my data or block the user
		// 	console.log(data);
		// 	return { currentUser };
		// } else {
		// 	throw new AppError('Unexpected response from external API', 500);
		// }

		return { currentUser };
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.log(error);
		if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
			throw new AppError('Invalid or expired token', 401);
		} else {
			throw new AppError('An error occurred. Please log in again', 401);
		}
	}
};
