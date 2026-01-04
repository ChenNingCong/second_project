import { Router } from 'express';
import { getAllProducts } from '../controllers/ProductsPageController.js';
const productRouter = Router();

productRouter.get('/', getAllProducts);
// userRouter.post('/', validateUserName, validatePassword, postCreateUser);
// userRouter.put('/', validateUserName, validatePassword, putUpdateUser);
// userRouter.delete('/:id', deleteUserById);

export default productRouter;
