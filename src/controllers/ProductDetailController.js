import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { NotFoundError } from "../utils/error.js";
import { param } from "express-validator";
export const queryValidator = [
    param('productId')
        .isMongoId()
        .withMessage('Invalid Product ID format')
];
export const getProductDetail = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const userId = req.session.userId;

        const product = await Product.findById(productId).populate('brand type');
        if (!product) {
            throw new NotFoundError(`Product ${productId} not found`)
        }
        const brandProducts = await Product.find({
            brand: product.brand,
            _id: { $ne: productId }
        }).limit(5);

        const user = await User.findById(userId);
        const isFavorited = user.favorites.includes(productId);

        res.render('ProductDetail', { product, brandProducts, isFavorited });
    } catch (err) {
        next(err);
    }
};