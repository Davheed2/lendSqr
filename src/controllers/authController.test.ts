// import { Request, Response } from 'express';
// import { authController } from './authController';
// import { userRepository } from '../repository/userRepository';
// import { AppError, hashPassword, generateAuthToken } from '../common/utils';

// // test('two plus two is four', () => {
// // 	expect(2 + 2).toBe(4);
// // });

// // Mocking dependencies
// jest.mock('../repository/userRepository');
// jest.mock('../common/utils');

// console.log(authController);

// const mockRequest = (body = {}, params = {}, query = {}) =>
//     ({
//         body,
//         params,
//         query,
//         ip: '127.0.0.1',
//     } as Partial<Request> as Request);

// const mockResponse = () => {
//     const res = {} as Partial<Response>;
//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);
//     return res as Response;
// };
// const next = jest.fn();

// describe('authController - signUp', () => {
//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     it('should successfully create a new user', async () => {
//         const req = mockRequest({
//             email: 'test@example.com',
//             password: 'password123!',
//             firstName: 'John',
//             lastName: 'Doe',
//             phoneNumber: '1234567890',
//             username: 'johndoe',
//         });
//         const res = mockResponse();

//         (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
//         (hashPassword as jest.Mock).mockResolvedValue('hashedPassword123');
//         (userRepository.create as jest.Mock).mockResolvedValue([
//             {
//                 id: 1,
//                 email: 'test@example.com',
//                 firstName: 'John',
//                 lastName: 'Doe',
//                 username: 'johndoe',
//                 phoneNumber: '1234567890',
// 				password: hashPassword
//             },
//         ]);
//         (generateAuthToken as jest.Mock).mockResolvedValue('mockToken123');

//         await authController.signUp(req, res); // Call the signUp method

// 		console.log(await userRepository.findByEmail('test@example.com'));

//         expect(await userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
//         //expect(await hashPassword).toHaveBeenCalledWith('password123!');
//         expect(await userRepository.create).toHaveBeenCalledWith(
//             expect.objectContaining({
//                 email: 'test@example.com',
//                 firstName: 'John',
//                 lastName: 'Doe',
//                 phoneNumber: '1234567890',
//                 username: 'johndoe',
//                 ipAddress: '127.0.0.1',
//             })
//         );

// 		// expect(await userRepository.create).toHaveBeenCalledWith(
//         //     expect.objectContaining({
// 		// 		"status": "success",
// 		// 		"data": Number,
// 		// 		"message": "User created successfully"
// 		// 	})
//         // );
//         expect(await generateAuthToken).toHaveBeenCalled();
//         expect(res.status).toHaveBeenCalledWith(201);
//         expect(res.json).toHaveBeenCalledWith(
//             expect.objectContaining({
//                 message: 'User created successfully',
//                 data: expect.any(Object),
//             })
//         );
//     });

//     it('should throw an error if the user already exists', async () => {
//         const req = mockRequest({
//             email: 'test@example.com',
//             password: 'password123!',
//             firstName: 'John',
//             lastName: 'Doe',
//             phoneNumber: '1234567890',
//             username: 'johndoe',
//         });
//         const res = mockResponse();

//         const next = jest.fn();

//         (userRepository.findByEmail as jest.Mock).mockResolvedValue({
//             email: 'test@example.com',
//             phoneNumber: '1234567890',
//             username: 'johndoe',
//         });

//         await expect(authController.signUp(req, res)).rejects.toThrow(AppError); // Expect it to throw

//         expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
//         expect(userRepository.create).not.toHaveBeenCalled();
//         expect(res.status).not.toHaveBeenCalled();
//     });
//     it('should throw an error for missing input fields', async () => {
//         const req = mockRequest({
//             email: '',
//             password: '',
//             firstName: '',
//             lastName: '',
//             phoneNumber: '',
//             username: '',
//         });
//         const res = mockResponse();
//         const next = jest.fn();

//         await expect(authController.signUp(req, res)).rejects.toThrow(AppError); // Expect it to throw

//         expect(userRepository.findByEmail).not.toHaveBeenCalled();
//         expect(res.status).not.toHaveBeenCalled();
//     });});
