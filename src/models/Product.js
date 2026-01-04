import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const ProductTypeScheme = new Schema({
    name : { type: String, required: true, unique: true }
})

const ProductType = mongoose.model('ProductType', ProductTypeScheme);

const ProductBrandScheme = new Schema({
    name : { type: String, required: true, unique: true }
})

const ProductBrand = mongoose.model('ProductBrand', ProductBrandScheme);

const ProductSchema = new Schema({
    title : { type: String, required: true},
    description : { type: String, required: true},
    type : { type: refType, ref: 'ProductType' },
    brand : { type: refType, ref: 'ProductBrand' },
    image_url: { type: String, required: true, unique: true },
});

const Product = mongoose.model('Product', ProductSchema);

export { ProductType, ProductBrand, Product, };
