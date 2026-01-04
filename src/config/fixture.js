import { Product, ProductBrand, ProductType } from "../models/Product.js";

function randomSelect(l) {
   return l[Math.floor(Math.random() * l.length)];
}
export async function createProducts() {
    const type_names = ["Computer", "Keyboard", "Mouse"]
    const brand_names = ["A", "B", "C", "D", "E"]
    const types = await ProductType.insertMany(type_names.map((e)=>({name:e})), )
    const brands = await ProductBrand.insertMany(brand_names.map((e)=>({name:e})))
    const data = []
    brands.forEach((brand) => {
        for (let i = 0; i < 6; i++) {
            const type = randomSelect(types);
            data.push({
                type : type._id,
                brand : brand._id,
                image_url : `https://dummyjson.com/image/400x200/008080/ffffff?text=${type.name}+${brand.name}+${data.length}`
            })
        }
    })
    await Product.insertMany(data);
}