const express = require("express");
const router = express.Router();
const {
  uploadProfileImage,
  updateProfile,
  getProfile,
  dashboardStats,
  getWarehouseProductStats,
} = require("../controllers/profile");
const authentication = require("../middlewares/authentication");
const authorizeRoles = require("../middlewares/authorizeRoles");

router
  .route("/profile")
  .get(authentication, authorizeRoles("shop", "warehouse"), getProfile)
  .patch(authentication, authorizeRoles("shop", "warehouse"), updateProfile);
router
  .route("/dashboard-stats")
  .get(authentication, authorizeRoles("warehouse"), dashboardStats);
router
  .route("/upload-profile-image")
  .post(
    authentication,
    authorizeRoles("shop", "warehouse"),
    uploadProfileImage
  );
router.route("/warehouse-product-stats").get(
  authentication,
  authorizeRoles("warehouse"),
  getWarehouseProductStats
);

module.exports = router;
