import { Product } from "../models/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}, 'name email');

    // if (!todo) {
    //   return res.status(404).json({ message: 'Todo not found' });
    // }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
};