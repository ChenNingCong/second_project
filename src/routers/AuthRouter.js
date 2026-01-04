import { Router } from 'express';
import * as AuthController from "../controllers/AuthController.js"
import { validate } from '../middlewares/Validate.js';
const authRouter = Router();

authRouter.post('/register', AuthController.registerQueryValidator, validate, AuthController.register); 
// userRouter.post('/', validateUserName, validatePassword, postCreateUser);
// userRouter.put('/', validateUserName, validatePassword, putUpdateUser);
// userRouter.delete('/:id', deleteUserById);

export default authRouter;
