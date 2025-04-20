const express = require("express");
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    deleteCartItem,
    clearCart
} = require('../controllers/cart');
const authentication = require("../middlewares/authentication");
const authorizeRoles = require("../middlewares/authorizeRoles");
const auths = [authentication, authorizeRoles("shop")];
router.route('/').get(...auths, getCart).post(...auths, addToCart);
router.route('/:cartItemId').patch(...auths, updateCartItem).delete(...auths, deleteCartItem);
router.route('/clear/:cardId').delete(...auths, clearCart);

module.exports = router;