import {
	AppError,
	catchAsync,
	comparePassword,
	generateAuthToken,
	hashPassword,
	toJSON,
	trim,
	validateEmail,
	validatePassword,
	validatePhoneNumber,
	validateUsername,
} from '@/common/utils';
import { userRepository } from '@/repository/userRepository';
import { Request, Response } from 'express';
import { AppResponse } from '@/common/utils';
import { IToken } from '@/common/interfaces';

class AuthController {
	signUp = catchAsync(async (req: Request, res: Response) => {
		let { email, password, firstName, lastName, phoneNumber, username } = req.body;

		if (!firstName || !lastName || !email || !username || !phoneNumber || !password) {
			throw new AppError('Incomplete signup data', 400);
		}

		firstName = trim(firstName);
		lastName = trim(lastName);
		email = validateEmail(email);
		phoneNumber = validatePhoneNumber(phoneNumber);
		username = validateUsername(username);
		password = validatePassword(password);

		const existingUser = await userRepository.findByEmail(email);
		if (existingUser) {
			if (existingUser.email === email) {
				throw new AppError('User with this email already exists', 409);
			} else if (existingUser.phoneNumber === phoneNumber) {
				throw new AppError('User with this phone number already exists', 409);
			} else if (existingUser.username === username) {
				throw new AppError('User with this username already exists', 409);
			}
		}

		const hashedPassword = await hashPassword(password);

		const [user] = await userRepository.create({
			email,
			password: hashedPassword,
			firstName,
			lastName,
			phoneNumber,
			username,
			ipAddress: req.ip,
		});

		console.log(user)

		const token: IToken = { user };
		await generateAuthToken(token);

		return AppResponse(res, 201, user, 'User created successfully');
	});

	signIn = catchAsync(async (req: Request, res: Response) => {
		const { email, password } = req.body;

		if (!email || !password) {
			throw new AppError('Please provide email and password', 400);
		}

		const user = await userRepository.findByEmail(email);
		if (!user) {
			throw new AppError('Invalid email or password', 401);
		}

		const isPasswordValid = await comparePassword(password, user.password);
		if (!isPasswordValid) {
			throw new AppError('Invalid email or password', 401);
		}

		await generateAuthToken(user.id);

		return AppResponse(res, 200, toJSON(user, ['password']), 'Login successful');
	});
}

export const authController = new AuthController();
