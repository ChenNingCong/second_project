import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

export const getProductDetail = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const userId = req.session.userId;

        // Fetch product and the brand gallery
        const product = await Product.findById(productId).populate('brand');
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const brandProducts = await Product.find({
            brand: product.brand,
            _id: { $ne: productId }
        }).limit(5);

        // Check if this product is in the user's favorites array
        let isFavorited = false;
        if (userId) {
            const user = await User.findById(userId);
            isFavorited = user.favorites.includes(productId);
        }

        res.render('ProductDetail', { product, brandProducts, isFavorited });
    } catch (err) {
        next(err);
    }
};