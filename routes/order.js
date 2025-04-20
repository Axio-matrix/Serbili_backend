const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getOrdersDetails,
  getUserOrdersByWarehouse,
  deleteOrder,
} = require("../controllers/order");
const authentication = require("../middlewares/authentication");
const authorizeRoles = require("../middlewares/authorizeRoles");
router.route("/").post(authentication, authorizeRoles('shop'), placeOrder);
router.route("/my-orders").get(authentication, authorizeRoles('shop'), getUserOrders);
router.route("/my-orders-warehouse").get(authentication, authorizeRoles('warehouse'), getUserOrdersByWarehouse);
router.route("/delete-order/:id").delete(authentication, authorizeRoles('shop'), deleteOrder);

router.route("/:id").get(authentication, authorizeRoles('shop', 'warehouse'), getOrdersDetails);

module.exports = router;
