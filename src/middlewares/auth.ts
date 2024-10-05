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
