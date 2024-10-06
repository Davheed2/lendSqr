import { AppError, catchAsync, trim, validateAmount } from '@/common/utils';
import { Request, Response } from 'express';
import { userRepository } from '@/repository/userRepository';
import { AppResponse } from '@/common/utils';

export class UserController {
	fundWallet = catchAsync(async (req: Request, res: Response) => {
		const { amount } = req.body;
		const { user } = req;

		if (!user) {
			throw new AppError('User not found', 404);
		}

		const validatedAmount = validateAmount(amount);

		if (!validatedAmount || validatedAmount <= 0) {
			throw new AppError('Please provide a valid amount', 400);
		}

		await userRepository.fundWallet(user.id, validatedAmount);

		return AppResponse(res, 200, null, 'Wallet funded successfully');
	});

	transferMoneyToUser = catchAsync(async (req: Request, res: Response) => {
		const { walletAddress, amount } = req.body;
		const { user } = req;

		if (!user) {
			throw new AppError('User not found', 404);
		}

		const validatedAmount = validateAmount(amount);
		const validateAddress = trim(walletAddress);

		if (validatedAmount <= 0) {
			throw new AppError('Transfer amount must be greater than zero', 400);
		}

		await userRepository.transferMoneyToUser(user.id, validateAddress, validatedAmount);

		return AppResponse(res, 200, null, 'Transfer successful');
	});

	withdrawFunds = catchAsync(async (req: Request, res: Response) => {
		const { amount } = req.body;
		const { user } = req;

		if (!user) {
			throw new AppError('User not found', 404);
		}

		const validatedAmount = validateAmount(amount);

		if (validatedAmount <= 0) {
			throw new AppError('Withdrawal amount must be greater than zero', 400);
		}

		const wallet = await userRepository.getBalance(user.id);
		const userBalance = wallet.walletBalance;

		if (userBalance < validatedAmount) {
			throw new AppError('Insufficient balance for withdrawal', 400);
		}

		await userRepository.updateBalance(user.id, userBalance, validatedAmount);

		return AppResponse(res, 200, null, 'Withdrawal successful');
	});

	getUsers = catchAsync(async (req: Request, res: Response) => {
		const users = await userRepository.getAllUsers();
		return AppResponse(res, 200, users, 'Users data retrieved successfully');
	});
}

export const userController = new UserController();
