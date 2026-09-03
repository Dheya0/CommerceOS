import { Router } from 'express';
import { authController } from '../controllers/auth.controller.ts';
import { validateBody } from '../validators/validator.ts';
import { LoginSchema, SwitchRoleSchema, RegisterSchema } from '../validators/dtos.ts';

export const authRouter = Router();

// POST /api/v1/auth/login
authRouter.post('/login', validateBody(LoginSchema), authController.login);

// POST /api/v1/auth/register
authRouter.post('/register', validateBody(RegisterSchema), authController.register);

// POST /api/v1/auth/logout
authRouter.post('/logout', authController.logout);

// GET /api/v1/auth/me
authRouter.get('/me', authController.getSession);

// POST /api/v1/auth/switch-role
authRouter.post('/switch-role', validateBody(SwitchRoleSchema), authController.switchRole);
