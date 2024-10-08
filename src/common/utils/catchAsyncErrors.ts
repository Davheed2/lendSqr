import { NextFunction, Request, Response } from 'express';

type CatchAsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;

export const catchAsync = (fn: CatchAsyncFunction) => {
	return (req: Request, res: Response, next: NextFunction) => {
		// Wrap the function call in a Promise.resolve to ensure it handles both async and non-async functions
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
