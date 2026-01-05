import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { succeed, ValidationError } from "../utils/error.js";


// 1. Add to Favorites
export const addFavorite = async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.session.userId;
    try {
        const user = await User.findById(userId);
        if (user.favorites.includes(productId)) {
            throw new ValidationError(`Item ${productId} is already in your favorites list.`)
        }
        // 2. Verify product exists in the database
        const productExists = await Product.exists({ _id: productId });
        if (!productExists) {
            throw new ValidationError(`The product you are trying to favorite ${productId} does not exist.` )
        }
        user.favorites.push(productId);
        await user.save();
        succeed(res, 200, {message: "Added to favorites"})
    } catch (err) {
        next(err);
    }
};

// 2. Remove from Favorites
export const removeFavorite = async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.session.userId;
    try {
        const user = await User.findById(userId);
        const index = user.favorites.indexOf(productId);

        // 422: The request is well-formed, but the item isn't there to be removed
        if (index === -1) {
            return res.status(422).json({ 
                error: "Unprocessable Content",
                message: `Item ${productId} not found in your favorites list.`
            });
        }
        // 2. Verify product exists in the database
        const productExists = await Product.exists({ _id: productId });
        if (!productExists) {
            return res.status(404).json({ 
                error: "Not Found", 
                message: `The product ${productId} you are trying to favorite does not exist.` 
            });
        }

        user.favorites.splice(index, 1);
        await user.save();

        res.status(200).json({ success: true, message: "Removed from favorites" });
    } catch (err) {
        next(err);
    }
};

export const getFavoriteList = async (req, res, next) => {
    const userId = req.session.userId;
    try {
        const data = await ((await User.findById(userId).populate('favorites', 'title')).favorites)
        res.status(200).json({ success: true, data : data });
    } catch (err) {
        next(err);
    }
}
