import Router from 'express';
import authRouter from './authRoutes.js';
import { todoRouter } from './todoRoutes.js';
import { tokenAuthenticate } from '../middleware/tokenAuthenticate.js';
export const router = Router();
router.use('/auth', authRouter);
router.use('/todo', tokenAuthenticate, todoRouter);
