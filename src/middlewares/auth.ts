import { AppError, authenticate } from '@/common/utils';
import { Response, Request, NextFunction } from 'express';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers['authorization'];
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new AppError('Authorization token missing', 401);
		}

		const accessToken = authHeader.split(' ')[1];
		const { currentUser } = await authenticate(accessToken);

		req.user = currentUser;

		next();
	} catch (error) {
		next(error);
	}
};

export default authMiddleware;

// if (axios.isAxiosError(error)) {
// 	// Handle specific Axios errors
// 	if (error.response) {
// 		if (error.response.status === 402) {
// 			throw new AppError('Payment required to access this service', 402);
// 		} else {
// 			throw new AppError(`External API error: ${error.response.data.message || 'Unknown error'}`, error.response.status);
// 		}
// 	} else if (error.request) {
// 		throw new AppError('No response from external API', 503);
// 	} else {
// 		throw new AppError('Error in requesting external API', 500);
// 	}
