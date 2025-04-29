const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
  getNotifaction,
  clearNotifications
} = require("../controllers/notifications");

const authentication = require("../middlewares/authentication");
const authorizeRoles = require("../middlewares/authorizeRoles");
const auths = [authentication, authorizeRoles("shop", "warehouse")];

router.route("/").get(...auths, getNotifications);
router.route("/clear").delete(...auths, clearNotifications);
router.route("/mark-all-as-read").patch(...auths, markAllNotificationsAsRead);
router
  .route("/mark-as-read/:notificationId")
  .patch(...auths, markNotificationAsRead);
router.route("/delete/:notificationId").delete(...auths, deleteNotification);
router.route("/:notificationId").get(...auths, getNotifaction);

module.exports = router;
