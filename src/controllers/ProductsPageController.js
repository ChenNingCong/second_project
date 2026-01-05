import { query, validationResult } from 'express-validator';
import { Product, ProductType, ProductBrand } from '../models/Product.js';

const queryValidator = [
  query('page').default(1).isInt({ min: 1 }).toInt(),
  query('brand').optional().isString().trim(),
  query('type').optional().isString().trim(),
  query('sort').optional().isIn(['newest', 'title']).default('newest')
]

const getPagedProductsWithFilter = async (req, res, next) => {
  try {
    const { page, brand, type, sort } = req.query;
    const limit = 9;
    const skip = (page - 1) * limit;
    let filterQuery = {};

    // 2. Strict Brand Validation
    if (brand) {
      const brandNames = [...new Set(brand.split(';').filter(Boolean))];
      const foundBrands = await ProductBrand.find({ name: { $in: brandNames } });

      // If some brands weren't found, trigger 422
      if (foundBrands.length !== brandNames.length) {
        return res.status(422).json({
          success: false,
          message: "One or more selected brands are invalid."
        });
      }
      filterQuery.brand = { $in: foundBrands.map(b => b._id) };
    }

    // 3. Strict Type Validation
    if (type) {
      const typeNames = [...new Set(type.split(';').filter(Boolean))];
      const foundTypes = await ProductType.find({ name: { $in: typeNames } });

      // If some types weren't found, trigger 422
      if (foundTypes.length !== typeNames.length) {
        return res.status(422).json({
          success: false,
          message: "One or more selected types are invalid."
        });
      }
      filterQuery.type = { $in: foundTypes.map(t => t._id) };
    }
    // 4. Define Sort Order
    let sortOption = {};
    switch (sort) {
      case 'title': sortOption = { title: 1 }; break;
      case 'newest': default: sortOption = { _id: -1 }; break;
    }

    // 5. Database Fetching
    const totalItems = await Product.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalItems / limit);
    /**
     * RANGE VALIDATION:
     * We allow page 1 even if totalItems is 0 (Empty State).
     * We throw 422 only if page > 1 AND page > totalPages.
     */
    if (page > 1 && page > totalPages) {
      return res.status(422).json({
        success: false,
        message: `Page ${page} is out of range. Max page is ${totalPages || 1}.`
      });
    }
    const products = await Product.find(filterQuery)
      .populate('brand type')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    // 5. Response
    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        totalItems,
        totalPages: totalPages || 1,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null
      }
    });

  } catch (err) {
    next(err);
  }
}

const getProductFilterList = async (req, res) => {
  res.status(200).json({ success: true, data: { 'brand': (await ProductBrand.find({}, 'name')).map((e)=>e.name), 'type': (await ProductType.find({}, 'name')).map((e)=>e.name) } })
}
export { queryValidator, getPagedProductsWithFilter, getProductFilterList }