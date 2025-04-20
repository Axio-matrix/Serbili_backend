const express = require("express");
const router = express.Router();
const {
  getProductReview,
  createProductReview,
  updateProductReview,
  deleteProductReview,
} = require("../controllers/ProductReview");

const authentication = require("../middlewares/authentication");
const authorizeRoles = require("../middlewares/authorizeRoles");
const auths = [authentication, authorizeRoles("shop")];
router
  .route("/:id")
  .get(getProductReview)
  .post(...auths, createProductReview)
  .patch(...auths, updateProductReview)
  .delete(...auths, deleteProductReview);

module.exports = router;
