const db = require("../db/models/index")
const { BadRequestError, UnauthenticatedError,ForbiddenError , NotFoundError} = require('../errors');
require('dotenv').config();
const asyncWrapper = require("../middlewares/async");
const { StatusCodes } = require('http-status-codes');
const {saveBase64Image} = require("../utils/saveBase64Image");

const getAllProducts = asyncWrapper(async (req, res) => {
    const whereClause = req.user.userType === 'admin' ? {} : { category: req.user.category };
    const products = await db.Product.findAll({
        where: whereClause,
    });
    
    if (!products) {
        throw new NotFoundError('No products found');
    }
    return res.status(StatusCodes.OK).json({products})
})

const getProduct = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const product = await db.Product.findOne({ where: { id } });
    if (!product) {
        throw new NotFoundError('Product not found');
    }
    return res.status(StatusCodes.OK).json({product})
})
const getProductsByWarehouse = asyncWrapper(async (req, res) => {
    const { id: warehouseId } = req.user;
    const products = await db.Product.findAll({ where: { warehouseId } });
    
    if (!products) {
        throw new NotFoundError('No products found for this warehouse');
    }
    return res.status(StatusCodes.OK).json({products})
})
const createProduct = asyncWrapper(async (req, res) => {
  const { name, price, stock, description,category, imageBase64  } = req.body;
  const { id :warehouseId } = req.user;
  if (!name || !price || !stock || !description || !category || !imageBase64  ) {
    throw new BadRequestError("Please fill all fields");
  }
  const imagePath = await saveBase64Image(imageBase64, "image", "product_image");
  const product = await db.Product.create({ name, price, stock,description, category, image:imagePath , warehouseId});
  return res.status(StatusCodes.CREATED).json({ product });
});

const updateProduct = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const [updated] = await db.Product.update(req.body, {
        where: { id }
    });
    if (!updated) {
        throw new NotFoundError('Product not found');
    }
    return res.status(StatusCodes.OK).json({msg: 'Product updated successfully'})
});

const deleteProduct = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const deleted = await db.Product.destroy({
        where: { id }
    });
    if (!deleted) {
        throw new NotFoundError('Product not found');
    }
    return res.status(StatusCodes.OK).json({msg: 'Product deleted successfully'})
});

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByWarehouse
}