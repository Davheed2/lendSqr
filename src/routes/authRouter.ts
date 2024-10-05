import { authController } from '@/controllers';
import express from 'express';

const router = express.Router();

router.post('/sign-up', authController.signUp);

export { router as authRouter };
