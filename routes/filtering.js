const express = require("express");
const router = express.Router();
const {
  getNearbyWarehouses,
  filterWarehousesByRating,
} = require("../controllers/filtering");
const authentication = require("../middlewares/authentication");
const authorizeRoles = require("../middlewares/authorizeRoles");

router
  .route("/warehouses/nearby")
  .get(authentication, authorizeRoles("shop"), getNearbyWarehouses)
router
  .route("/warehouses/rating")
  .get(authentication, authorizeRoles("shop"), filterWarehousesByRating);

module.exports = router;
