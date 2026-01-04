import { Router } from 'express';
import * as ProductDetailController from '../controllers/ProductDetailController.js';
const productDetailRouter = Router();
productDetailRouter.get('/details/:productId', ProductDetailController.getProductDetail);
export default productDetailRouter;
