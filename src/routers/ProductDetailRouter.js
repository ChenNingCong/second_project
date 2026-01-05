import { Router } from 'express';
import * as ProductDetailController from '../controllers/ProductDetailController.js';
import { validate } from '../middlewares/Validate.js';
const productDetailRouter = Router();
productDetailRouter.get('/details/:productId', ProductDetailController.queryValidator, validate, ProductDetailController.getProductDetail);
export default productDetailRouter;
