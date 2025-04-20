const db = require('../db/models/index');
const asyncWrapper = require('../middlewares/async');
const { StatusCodes } = require('http-status-codes');
const { 
    UnauthenticatedError,
    NotFoundError,
    BadRequestError,
    ForbiddenError, 
} = require('../errors');

// Helper function to update product rating
const updateProductRating = async (productId) => {
    const avgRatingData = await db.ReviewProduct.findOne({
        where: { productId },
        attributes: [
            [db.Sequelize.fn('AVG', db.Sequelize.col('rating')), 'avgRating'],
        ],
        raw: true,
    });

    const newRating = avgRatingData ? parseFloat(avgRatingData.avgRating).toFixed(1) : null;
    
    await db.Product.update(
        { rating: newRating },
        { where: { id: productId } }
    );
    
    return newRating;
};

const getProductReview = asyncWrapper(async (req, res) => {
    const { id: productId } = req.params;
    const product = await db.Product.findByPk(productId, {
        attributes: ['rating']
    });
    
    if (!product) {
        throw new NotFoundError('Product not found');
    }
    
    return res.status(StatusCodes.OK).json({ 
        rating: product.rating 
    });
});

const createProductReview = asyncWrapper(async (req, res) => {
    const { rating } = req.body;
    const { id: shopId } = req.user;
    const { id: productId } = req.params;

    const product = await db.Product.findByPk(productId);
    if (!product) throw new NotFoundError('Product not found');

    const existingReview = await db.ReviewProduct.findOne({
        where: { shopId, productId },
    });

    if (existingReview) {
        throw new BadRequestError('You have already reviewed this product');
    }

    await db.ReviewProduct.create({ shopId, productId, rating });
    await updateProductRating(productId);

    return res.status(StatusCodes.CREATED).json({ 
        msg: 'Review added successfully' 
    });
});

const updateProductReview = asyncWrapper(async (req, res) => {
    const { rating } = req.body;
    const { id: shopId } = req.user;
    const { id: productId } = req.params;

    const product = await db.Product.findByPk(productId);
    if (!product) throw new NotFoundError('Product not found');

    const review = await db.ReviewProduct.findOne({ 
        where: { shopId, productId } 
    });
    
    if (!review) throw new NotFoundError('Review not found');

    await review.update({ rating });
    await updateProductRating(productId);

    return res.status(StatusCodes.OK).json({ 
        msg: 'Review updated successfully' 
    });
});

const deleteProductReview = asyncWrapper(async (req, res) => {
    const { id: shopId } = req.user;
    const { id: productId } = req.params;

    const product = await db.Product.findByPk(productId);
    if (!product) throw new NotFoundError('Product not found');

    const review = await db.ReviewProduct.findOne({ 
        where: { shopId, productId } 
    });
    
    if (!review) throw new NotFoundError('Review not found');

    await review.destroy();
    await updateProductRating(productId);

    return res.status(StatusCodes.OK).json({ 
        msg: 'Review deleted successfully' 
    });
});

module.exports = {
    getProductReview,
    createProductReview,
    updateProductReview,
    deleteProductReview
};