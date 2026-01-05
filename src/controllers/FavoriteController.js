import { body, param } from "express-validator";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { succeed, ValidationError } from "../utils/error.js";

export const queryValidator = [
    param('productId')
        .isMongoId()
        .withMessage('Invalid Product ID format')
];

export const addFavorite = async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.session.userId;
    try {
        const user = await User.findById(userId);
        if (user.favorites.includes(productId)) {
            throw new ValidationError(`Item ${productId} is already in your favorites list.`)
        }
        const productExists = await Product.exists({ _id: productId });
        if (!productExists) {
            throw new ValidationError(`The product you are trying to favorite ${productId} does not exist.`)
        }
        user.favorites.push(productId);
        await user.save();
        succeed(res, 200, { message: "Added to favorites" })
    } catch (err) {
        next(err);
    }
};

export const removeFavorite = async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.session.userId;
    try {
        const user = await User.findById(userId);
        const index = user.favorites.indexOf(productId);
        if (index === -1) {
            throw new ValidationError(`Item ${productId} not found in your favorites list.`)
        }
        user.favorites.splice(index, 1);
        await user.save();
        succeed(res, 200, { message: "Removed from favorites" })
    } catch (err) {
        next(err);
    }
};

export const getFavoriteList = async (req, res, next) => {
    const userId = req.session.userId;
    try {
        const data = await ((await User.findById(userId).populate('favorites', 'title')).favorites)
        succeed(res, 200, data)
    } catch (err) {
        next(err);
    }
}
