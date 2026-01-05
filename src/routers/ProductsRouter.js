import { Router } from 'express';
import * as ProductsPageController from '../controllers/ProductsPageController.js';
import * as ProductDetailController from '../controllers/ProductDetailController.js';
import { validate } from '../middlewares/Validate.js';
const productsRouter = Router();

productsRouter.get('/', ProductsPageController.queryValidator, validate, ProductsPageController.getPagedProductsWithFilter);
productsRouter.get('/filters', ProductsPageController.getProductFilterList);
// productsRouter.get('/details/:productId', ProductDetailController.getProductDetail);

export default productsRouter;
