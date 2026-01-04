import { Product, ProductBrand, ProductType } from "../../src/models/Product.js";
import { User } from "../../src/models/User.js";

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
            const base = `${type.name}+${brand.name}+${data.length}`
            data.push({
                title : `Name for ${base}`,
                description : `Description for ${base}`,
                type : type._id,
                brand : brand._id,
                image_url : `https://dummyjson.com/image/400x200/008080/ffffff?text=${base}`
            })
        }
    })
    await Product.insertMany(data);
    await User.insertOne({username:"test", 'email':"test@gmail.com", password:"12345678", favorites:[]});
}