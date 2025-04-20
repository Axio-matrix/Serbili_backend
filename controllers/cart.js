const db = require("../db/models/index")
const { BadRequestError, UnauthenticatedError,ForbiddenError , NotFoundError} = require('../errors');
require('dotenv').config();
const asyncWrapper = require("../middlewares/async");
const { StatusCodes } = require('http-status-codes');

const getCart = asyncWrapper(async (req, res) => {
    const { id: userId } = req.user; 
    console.log('the userId', userId);
    
    let cart = await db.Cart.findOne({
      where: { userId },
      include: [
        {
          model: db.CartItem,
          as: "cartItems",
          include: [{ model: db.Product, as: "product" }],
        },
      ],
    });
    
    if (!cart) {
        cart = await db.Cart.create({ userId });
    }

    return res.status(StatusCodes.OK).json({cart})
});

const addToCart = asyncWrapper(async (req, res) => {
    const { id: userId } = req.user;
    const { productId, quantity, size, color } = req.body;
    const product = await db.Product.findByPk(productId);
    if (!product) {
        throw new NotFoundError('Product not found');
    };
    
    let cart = await db.Cart.findOne({
        where: { userId },
        include: [
            {
                model: db.CartItem,
                as: 'cartItems',
                include: [{ model: db.Product, as: 'product' }],
            },
        ],
    });
    if (!cart) {
        cart = await db.Cart.create({ userId });
    }

    const [cartItem, created] = await db.CartItem.findOrCreate({
        where: { cartId: cart.id, productId, size: size ?? null, color : color ?? null },
        defaults: { quantity },
    });

    if (!created) {
        cartItem.quantity += quantity;
        await cartItem.save();
    }
    return res.status(StatusCodes.OK).json({msg: 'Item added to cart',cartItem})
});

const updateCartItem = asyncWrapper(async (req, res) => {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    const cartItem = await db.CartItem.findByPk(cartItemId);
    if (!cartItem) {
        throw new NotFoundError('Cart item not found');
    }
    cartItem.quantity = quantity;
    await cartItem.save();
    return res.status(StatusCodes.OK).json({msg: 'Cart item updated successfully',cartItem})
});

const deleteCartItem = asyncWrapper(async (req, res) => {
    const { cartItemId } = req.params;
    const cartItem = await db.CartItem.findByPk(cartItemId);
    if (!cartItem) {
        throw new NotFoundError('Cart item not found');
    }
    await cartItem.destroy();
    return res.status(StatusCodes.OK).json({msg: 'Cart item deleted successfully'})
});

const clearCart = asyncWrapper(async (req, res) => {
    const { id: userId } = req.user;
    
    const cart = await db.Cart.findOne({ where: {userId} });
    
    if (!cart) {
        throw new NotFoundError('Cart not found');
    }
    await db.CartItem.destroy({ where: { cartId: cart.id } });
    
    return res.status(StatusCodes.OK).json({msg: 'Cart cleared successfully'})
});

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    deleteCartItem,
    clearCart
}