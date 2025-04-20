const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const authorizeRoles = require("../middlewares/authorizeRoles");
const {
  getWarehouseReview,
  createWarehouseReview,
  updateWarehouseReview,
  deleteWarehouseReview,
} = require("../controllers/warehouseReview");

const auths = [authentication, authorizeRoles("shop")];
router
  .route("/:id")
  .get(getWarehouseReview)
  .post(...auths, createWarehouseReview)
  .patch(...auths, updateWarehouseReview)
  .delete(...auths, deleteWarehouseReview);

module.exports = router;
