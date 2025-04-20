const db = require("../db/models/index");
const {
  BadRequestError,
  UnauthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("../errors");
const asyncWrapper = require("../middlewares/async");
const { Op } = require("sequelize");
const { StatusCodes } = require("http-status-codes");

const getNearbyWarehouses = asyncWrapper(async (req, res) => {
  const { radius = 20 } = req.query; // radius in km
  const { latitude: shopLat, longitude: shopLng } = req.user; // Assuming the shop's location is stored in the user object
  if (!shopLat || !shopLng) {
    throw new BadRequestError(
      "Shop location (latitude and longitude) is required"
    );
  }

  const warehouses = await db.Users.findAll({
    where: {
      userType: "warehouse",
      latitude: { [db.Sequelize.Op.ne]: null },
      longitude: { [db.Sequelize.Op.ne]: null },
    },
  });
  const haversine = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const nearbyWarehouses = warehouses.filter((warehouse) => {
    const distance = haversine(
      shopLat,
      shopLng,
      warehouse.latitude,
      warehouse.longitude
    );
    return distance <= radius;
  });

  res.status(StatusCodes.OK).json({ warehouses: nearbyWarehouses });
});

const filterWarehousesByRating = asyncWrapper(async (req, res) => {
  const { minRating = 0, maxRating = 5 } = req.query;

  const warehouses = await db.Users.findAll({
    where: {
      userType: "warehouse",
      rating: {
        [db.Sequelize.Op.gte]: minRating,
        [db.Sequelize.Op.lte]: maxRating,
      },
    },
    attributes: ["id", "firstname", "lastname", "rating", "email"],
    order: [["rating", "DESC"]],
  });

  if (!warehouses || warehouses.length === 0) {
    throw new NotFoundError("No warehouses found with the given rating filter");
  }

  return res.status(StatusCodes.OK).json({ warehouses });
});

const getAllwarehouses = asyncWrapper(async (req, res) => {
  const warehouses = await db.Users.findAll({
    where: { userType: "warehouse" },
  });

  if (!warehouses || warehouses.length === 0) {
    throw new NotFoundError("No warehouses found");
  }

  return res.status(StatusCodes.OK).json({ warehouses });
});

module.exports = {
  getNearbyWarehouses,
  filterWarehousesByRating,
  getAllwarehouses
};
