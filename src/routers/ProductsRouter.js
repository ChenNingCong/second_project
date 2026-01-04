import { Router } from 'express';
import * as ProductsPageController from '../controllers/ProductsPageController.js';
import * as ProductDetailController from '../controllers/ProductDetailRouter.js';
import { validate } from '../middlewares/Validate.js';
const productRouter = Router();

productRouter.get('/', ProductsPageController.queryValidator, validate, ProductsPageController.getPagedProductsWithFilter);
productRouter.get('/filters', ProductsPageController.getProductFilterList);
productRouter.get('/details/:productId', ProductDetailController.getProductDetail);

export default productRouter;
