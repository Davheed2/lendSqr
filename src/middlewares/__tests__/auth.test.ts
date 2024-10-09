import { Request, Response } from 'express';
import { AppError, authenticate } from '@/common/utils';
import authMiddleware from '../auth';

jest.mock('@/common/utils', () => ({
	AppError: jest.fn(),
	authenticate: jest.fn(),
}));

describe('authMiddleware', () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let mockNext: jest.Mock;

	beforeEach(() => {
		mockRequest = {
			headers: {},
		};
		mockResponse = {};
		mockNext = jest.fn();
	});

	it('should throw an error if authorization header is missing', async () => {
		await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

		expect(AppError).toHaveBeenCalledWith('Authorization token missing', 401);
		expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
	});

	it('should throw an error if authorization header does not start with "Bearer "', async () => {
		mockRequest.headers = { authorization: 'InvalidToken' };

		await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

		expect(AppError).toHaveBeenCalledWith('Authorization token missing', 401);
		expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
	});

	it('should call authenticate with the correct access token', async () => {
		mockRequest.headers = { authorization: 'Bearer validToken' };
		(authenticate as jest.Mock).mockResolvedValue({ currentUser: { id: '1', name: 'Test User' } });

		await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

		expect(authenticate).toHaveBeenCalledWith('validToken');
	});

	it('should set the user in the request object', async () => {
		mockRequest.headers = { authorization: 'Bearer validToken' };
		const mockUser = { id: '1', name: 'Test User' };
		(authenticate as jest.Mock).mockResolvedValue({ currentUser: mockUser });

		await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

		expect(mockRequest.user).toEqual(mockUser);
	});

	it('should call next without arguments on successful authentication', async () => {
		mockRequest.headers = { authorization: 'Bearer validToken' };
		(authenticate as jest.Mock).mockResolvedValue({ currentUser: { id: '1', name: 'Test User' } });

		await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

		expect(mockNext).toHaveBeenCalledWith();
	});

	it('should pass any error from authenticate to next', async () => {
		mockRequest.headers = { authorization: 'Bearer validToken' };
		const mockError = new Error('Authentication failed');
		(authenticate as jest.Mock).mockRejectedValue(mockError);

		await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

		expect(mockNext).toHaveBeenCalledWith(mockError);
	});
});
