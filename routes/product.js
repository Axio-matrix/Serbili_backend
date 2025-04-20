const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByWarehouse,
} = require("../controllers/product");
const authentication = require("../middlewares/authentication");
const authorizeRoles = require("../middlewares/authorizeRoles");
const auths = [authentication, authorizeRoles("warehouse")];
router
  .route("/")
  .get(
    authentication,
    authorizeRoles("admin", "shop", "warehouse"),
    getAllProducts
  )
  .post(...auths, createProduct);
router.route("/warehouse").get(...auths, getProductsByWarehouse);
router
  .route("/:id")
  .get(authentication, authorizeRoles("shop"), getProduct)
  .patch(...auths, updateProduct)
  .delete(...auths, deleteProduct);

module.exports = router;
