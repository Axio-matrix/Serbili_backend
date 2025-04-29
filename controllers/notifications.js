const db = require("../db/models/index");
const {
  BadRequestError,
  UnauthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("../errors");
const asyncWrapper = require("../middlewares/async");
const { StatusCodes } = require("http-status-codes");

const getNotifications = asyncWrapper(async (req, res) => {
  const { id: userId } = req.user;
  const notifications = await db.Notification.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
  res.status(StatusCodes.OK).json({ notifications });
});

const markAllNotificationsAsRead = asyncWrapper(async (req, res) => {
  const { id: userId } = req.user;
  await db.Notification.update(
    { isRead: true },
    { where: { userId, isRead: false } }
  );
  res.status(StatusCodes.OK).json({ msg: "All notifications marked as read" });
});

const markNotificationAsRead = asyncWrapper(async (req, res) => {
  const { id: userId } = req.user;
  const { notificationId } = req.params;
  const notification = await db.Notification.findOne({
    where: { id: notificationId, userId },
  });
  if (!notification) {
    throw new NotFoundError("Notification not found");
  }
  await db.Notification.update(
    { isRead: true },
    { where: { id: notificationId, userId } }
  );
  res.status(StatusCodes.OK).json({ msg: "Notification marked as read" });
});

const deleteNotification = asyncWrapper(async (req, res) => {
  const { id: userId } = req.user;
  const { notificationId } = req.params;
  const notification = await db.Notification.findOne({
    where: { id: notificationId, userId },
  });
  if (!notification) {
    throw new NotFoundError("Notification not found");
  }
  await db.Notification.destroy({ where: { id: notificationId, userId } });
  res.status(StatusCodes.OK).json({ msg: "Notification deleted" });
});

const getNotifaction = asyncWrapper(async (req, res) => {
  const { id: userId } = req.user;
  const { notificationId } = req.params;
  const notification = await db.Notification.findOne({
    where: { id: notificationId, userId },
  });
  if (!notification) {
    throw new NotFoundError("Notification not found");
  }
  res.status(StatusCodes.OK).json({ notification });
});

const clearNotifications = asyncWrapper(async (req, res) => {
  const { id: userId } = req.user;
  await db.Notification.destroy({ where: { userId } });
  res.status(StatusCodes.OK).json({ msg: "All notifications cleared" });
});

module.exports = {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
  getNotifaction,
  clearNotifications
};