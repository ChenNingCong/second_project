import { Router } from 'express';
import { addFavorite, getFavoriteList, queryValidator, removeFavorite } from '../controllers/FavoriteController.js';
import { validate } from '../middlewares/Validate.js';
const favoriteRouter = Router();

favoriteRouter.get('/', getFavoriteList)
favoriteRouter.post('/:productId', queryValidator, validate, addFavorite); 
favoriteRouter.delete('/:productId', queryValidator, validate, removeFavorite)

export default favoriteRouter;
