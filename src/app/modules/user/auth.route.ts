import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { UserValidation } from './auth.validation';

const router = express.Router();

router.post('/signup',
    validateRequest(UserValidation.create),
    AuthController.insertIntoDB)

export const AuthRoutes = router