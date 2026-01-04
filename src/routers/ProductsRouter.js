import { Router } from 'express';
import * as ProductsPageController from '../controllers/ProductsPageController.js';
import * as ProductDetailController from '../controllers/ProductDetailRouter.js';
import { validate } from '../middlewares/Validate.js';
const productRouter = Router();

productRouter.get('/', ProductsPageController.queryValidator, validate, ProductsPageController.getPagedProductsWithFilter);
productRouter.get('/filters', ProductsPageController.getProductFilterList);
productRouter.get('/details/:productId', ProductDetailController.getProductDetail);
// userRouter.post('/', validateUserName, validatePassword, postCreateUser);
// userRouter.put('/', validateUserName, validatePassword, putUpdateUser);
// userRouter.delete('/:id', deleteUserById);

export default productRouter;
