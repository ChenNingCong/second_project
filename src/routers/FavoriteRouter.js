import { Router } from 'express';
import { addFavorite, getFavoriteList, removeFavorite } from '../controllers/FavoriteController.js';
const favoriteRouter = Router();

favoriteRouter.get('/', getFavoriteList)
favoriteRouter.post('/:productId', addFavorite); 
favoriteRouter.delete('/:productId', removeFavorite)

export default favoriteRouter;
