const db = require("../db/models/index");
const asyncWrapper = require("../middlewares/async");
const { StatusCodes } = require("http-status-codes");
const {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require("../errors");

// Helper function to update warehouse rating
const updateWarehouseRating = async (warehouseId) => {
  const avgRatingData = await db.WarehouseReview.findOne({
    where: { warehouseId },
    attributes: [
      [db.Sequelize.fn("AVG", db.Sequelize.col("rating")), "avgRating"],
    ],
    raw: true,
  });

  const newRating = avgRatingData ? parseFloat(avgRatingData.avgRating).toFixed(1) : null;
  
  await db.Users.update(
    { rating: newRating },
    { where: { id: warehouseId } }
  );
  
  return newRating;
};

const getWarehouseReview = asyncWrapper(async (req, res) => {
  const { id: warehouseId } = req.params;
  const warehouse = await db.Users.findOne({
    where: { id: warehouseId, userType: "warehouse" },
    attributes: ["rating"],
  });

  if (!warehouse) {
    throw new NotFoundError("Warehouse not found");
  }

  return res.status(StatusCodes.OK).json({ 
    rating: warehouse.rating 
  });
});

const createWarehouseReview = asyncWrapper(async (req, res) => {
  const { rating } = req.body;
  const { id: shopId } = req.user;
  const { id: warehouseId } = req.params;

  const warehouse = await db.Users.findOne({
    where: { id: warehouseId, userType: "warehouse" },
  });

  if (!warehouse) {
    throw new NotFoundError("Warehouse not found");
  }

  const existingReview = await db.WarehouseReview.findOne({
    where: { shopId, warehouseId },
  });

  if (existingReview) {
    throw new BadRequestError("You have already reviewed this warehouse");
  }

  await db.WarehouseReview.create({ shopId, warehouseId, rating });
  
  // Update the warehouse's average rating
  await updateWarehouseRating(warehouseId);

  return res.status(StatusCodes.CREATED).json({ 
    msg: "Review added successfully" 
  });
});

const updateWarehouseReview = asyncWrapper(async (req, res) => {
  const { rating } = req.body;
  const { id: shopId } = req.user;
  const { id: warehouseId } = req.params;

  const warehouse = await db.Users.findOne({
    where: { id: warehouseId, userType: "warehouse" },
  });

  if (!warehouse) {
    throw new NotFoundError("Warehouse not found");
  }

  const existingReview = await db.WarehouseReview.findOne({
    where: { shopId, warehouseId },
  });

  if (!existingReview) {
    throw new NotFoundError("Review not found");
  }

  await existingReview.update({ rating });
  await updateWarehouseRating(warehouseId);

  return res.status(StatusCodes.OK).json({ 
    msg: "Review updated successfully" 
  });
});

const deleteWarehouseReview = asyncWrapper(async (req, res) => {
  const { id: shopId } = req.user;
  const { id: warehouseId } = req.params;

  const warehouse = await db.Users.findOne({
    where: { id: warehouseId, userType: "warehouse" },
  });

  if (!warehouse) {
    throw new NotFoundError("Warehouse not found");
  }

  const review = await db.WarehouseReview.findOne({
    where: { shopId, warehouseId },
  });

  if (!review) {
    throw new NotFoundError("Review not found");
  }

  await review.destroy();
  await updateWarehouseRating(warehouseId);

  return res.status(StatusCodes.OK).json({ 
    msg: "Review deleted successfully" 
  });
});

module.exports = {
  getWarehouseReview,
  createWarehouseReview,
  updateWarehouseReview,
  deleteWarehouseReview
};