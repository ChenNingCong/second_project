import mongoose from "mongoose";
import { Product } from "../models/Product.js";

const getProductDetail = async (req, res) => {
    try {
        const { productId } = req.id;

        // If ID is physically malformed (wrong length/chars)
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(422).json({ error: "Invalid product ID format" });
        }

        const product = await Product.findById(productId);

        // if ID is valid format but doesn't exist in DB
        if (!product) {
            return res.status(422).json({ error: "Product doesn’t exist" });
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(400).send("Bad Request");
    }
};

export {getProductDetail}