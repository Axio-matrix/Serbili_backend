const db = require("../db/models/index")
const { BadRequestError, UnauthenticatedError,ForbiddenError , NotFoundError} = require('../errors');
require('dotenv').config();
const asyncWrapper = require("../middlewares/async");
const { StatusCodes } = require('http-status-codes');


//get all products raha admin yjib kol l products w shop yjib l products ta3 same category

const getAllProducts = asyncWrapper(async (req, res) => {
    const products = await db.Product.findAll({
        where: { category: req.user.category },
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
//hadi ta3 l warehouses , getALlProducts by warehouseId
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
//   const imagePath = await saveBase64Image(imageBase64, "image", "product_image");
  const product = await db.Product.create({ name, price, stock,description, category, image:imageBase64 , warehouseId});
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
// hadi ta3 l shops yjib l products ta3 warehouse 

const getProductsByWarehouseForShops = asyncWrapper(async (req, res) => {
    const { id: warehouseId } = req.params;
    const products = await db.Product.findAll({ where: { warehouseId } });
    
    if (!products) {
        throw new NotFoundError('No products found for this warehouse');
    }
    return res.status(StatusCodes.OK).json({products})
})
module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByWarehouse,
    getProductsByWarehouseForShops
}