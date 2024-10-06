import authMiddleware from '@/middlewares/auth';
import { userController } from '@/controllers/userController';

import express from 'express';

const router = express.Router();

router.get('/', authMiddleware, userController.getUsers);
router.post('/wallet/fund', authMiddleware, userController.fundWallet);
router.post('/transfer/fund', authMiddleware, userController.transferMoneyToUser);
router.post('/transfer/fund', authMiddleware, userController.transferMoneyToUser);
router.post('/withdraw', authMiddleware, userController.withdrawFunds);

export { router as userRouter };
