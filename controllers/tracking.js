const db = require("../db/models");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError, ForbiddenError } = require("../errors");
const asyncWrapper = require("../middlewares/async");

const updateOrderStatus = asyncWrapper(async (req, res) => {
  const { id: orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELED'];
  if (!validStatuses.includes(status)) {
    throw new BadRequestError("Invalid order status");
  }

  const order = await db.Order.findOne({ where: { id: orderId } });

  if (!order) {
    throw new NotFoundError("Order not found");
  }


  // Optional: Prevent downgrading status (e.g., delivered -> shipped)
  const currentStatusIndex = validStatuses.indexOf(order.status);
  const newStatusIndex = validStatuses.indexOf(status);
  if (newStatusIndex < currentStatusIndex) {
    throw new BadRequestError("You cannot downgrade the order status");
  }

  order.status = status;

  // Set the timestamp for the new status
  if (status === "SHIPPED") order.shippedAt = new Date();
  else if (status === "DELIVERED") order.deliveredAt = new Date();
  else if (status === "CANCELED") order.canceledAt = new Date();

  await order.save();

  const io = req.app.get('io');

  io.to(`user_${order.userId}`).emit('order-status-updated', {
    orderId: order.id,
    status: order.status,
    updatedAt: new Date(),
    message: `Your order #${order.id} has been updated to ${order.status}`,
  });
  await db.Notification.create({
    userId: order.userId,
    message: `Your order #${order.id} has been updated to ${order.status}`,
    isRead: false,
  });
  return res
    .status(StatusCodes.OK)
    .json({ msg: "Order status updated", order });
});
const notifyWarehouseOrderReceived = asyncWrapper(async (req, res) => {
  const { id: orderId } = req.params;

  const order = await db.Order.findOne({
    where: { id: orderId },
    include: [
      { model: db.Users, as: "warehouse", attributes: ["id"] }, // if you set this alias
    ],
  });

  if (!order) throw new NotFoundError("Order not found");

  if (order.status !== "SHIPPED") {
    throw new BadRequestError("Order must be SHIPPED to confirm receipt");
  }

  const io = req.app.get("io");

  // Notify warehouse
  if (order.warehouse) {
    io.to(`user_${order.warehouse.id}`).emit("order-received-by-shop", {
      orderId: order.id,
      updatedAt: new Date(),
      message: `Shop has confirmed receipt of order #${order.id}`,
    });
    await db.Notification.create({
      userId: order.warehouse.id,
      message: `Shop has confirmed receipt of order #${order.id}`,
      isRead: false,
    });
  }

  // Optional: Auto-mark as DELIVERED by system
  order.status = "DELIVERED";
  order.deliveredAt = new Date();
  await order.save();

  io.to(`user_${order.userId}`).emit("order-status-updated", {
    orderId: order.id,
    status: "DELIVERED",
    updatedAt: new Date(),
    message: `Your order #${order.id} has been marked as DELIVERED`,
  });
  await db.Notification.create({
    userId: order.userId,
    message: `Your order #${order.id} has been marked as DELIVERED`,
    isRead: false,
  });

  return res.status(StatusCodes.OK).json({
    msg: "Warehouse notified and order marked as DELIVERED",
  });
});


module.exports = {
  updateOrderStatus,
  notifyWarehouseOrderReceived
};
