import { authController } from '@/controllers';
import express from 'express';

const router = express.Router();

router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);

export { router as authRouter };
