const asyncWrapper = require("../middlewares/async");
const db = require("../db/models");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
// const {saveBase64Image} = require("../utils/saveBase64Image");
const { Op } = require("sequelize");
const getProfile = asyncWrapper(async (req, res) => {
  const user = await db.Users.findOne({
    where: {
      id: req.user.id,
    },
    attributes: [
      "id",
      "firstname",
      "lastname",
      "email",
      "phoneNumber",
      "address",
      "profileImage",
      "emergencyContact",
    ],
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }
  return res.status(StatusCodes.OK).json({ user });
});

const dashboardStats = asyncWrapper(async (req, res) => {
  const { id: userId } = req.user;
  const netSales = await db.Order.sum("totalAmount", {
    where: { userId, isPaid: true },
  });

  const delivredOrders = await db.Order.count({
    where: { userId, status: "DELIVERED" },
  });

  const nOrders = await db.Order.count({
    where: { userId, status: { [Op.ne]: "CANCELED" } },
  });

  const nCustomers = await db.Order.count({
    distinct: true,
    where: { userId },
    col: "userId",
  });

  const salesTrends = await db.Order.findAll({
    where: {
      userId,
      createdAt: {
        [db.Sequelize.Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
    },
    attributes: [
      [db.Sequelize.fn("DATE", db.Sequelize.col("createdAt")), "date"],
      [db.Sequelize.fn("SUM", db.Sequelize.col("totalAmount")), "totalSales"],
    ],
    group: ["date"],
    order: [["date", "ASC"]],
  });

  return res.status(StatusCodes.OK).json({
    netSales,
    delivredOrders,
    nOrders,
    nCustomers,
    salesTrends,
  });
});

const uploadProfileImage = asyncWrapper(async (req, res) => {
  const { id: userId } = req.user;
  const { imageBase64 } = req.body;
  if (!imageBase64) {
    throw new BadRequestError("Please provide an image");
  }
  // const imagePath = await saveBase64Image(imageBase64, 'image', 'profile_image');
  const user = await db.Users.findByPk(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  await user.update({ profileImage: imageBase64 });

  return res
    .status(StatusCodes.OK)
    .json({ message: "Profile image updated successfully", imageBase64 });
});

const updateProfile = asyncWrapper(async (req, res) => {
  const { id: userId } = req.user;
  const {
    firstname,
    lastname,
    email,
    phoneNumber,
    address,
    emergencyContact,
    category,
    latitude,
    longitude,
  } = req.body;

  const user = await db.Users.findByPk(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  await user.update({
    firstname,
    lastname,
    email,
    phoneNumber,
    address,
    emergencyContact,
    category,
    latitude,
    longitude,
  });

  return res
    .status(StatusCodes.OK)
    .json({ message: "Profile updated successfully" });
});

const getWarehouseProductStats = asyncWrapper(async (req, res) => {
  const warehouseId = req.user.id;

  const products = await db.Product.findAll({
    where: { warehouseId },
    include: [
      {
        model: db.OrderItem,
        as: "orderItems",
        include: [
          {
            model: db.Order,
            as: "order",
            attributes: ["isPaid"],
            where: { isPaid: true }, // Only include paid orders
          },
        ],
        attributes: ["quantity", "price"],
      },
    ],
  });

  const result = products.map((product) => {
    const numberOfSells = product.orderItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const netProfitValue = product.orderItems.reduce(
      (sum, item) => sum + item.quantity * parseFloat(item.price),
      0
    );

    return {
      id: product.id,
      name: product.name,
      image: product.image,
      remainingNumber: product.stock,
      numberOfSells,
      netProfit: netProfitValue,
    };
  });

  res.status(200).json(result);
});

const getNetSalesPerMonth = asyncWrapper(async (req, res) => {
  const { id: warehouseId } = req.user;

  const salesData = await db.Order.findAll({
    where: {
      warehouseId,
      isPaid: true,
    },
    attributes: [
      [db.Sequelize.fn('DATE_TRUNC', 'month', db.Sequelize.col('createdAt')), 'month'],
      [db.Sequelize.fn('SUM', db.Sequelize.col('totalAmount')), 'totalSales']
    ],
    group: ['month'],
    order: [[db.Sequelize.literal('month'), 'ASC']],
    raw: true,
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formattedSales = monthNames.map((name, index) => {
    const entry = salesData.find(item => {
      const date = new Date(item.month);
      return date.getMonth() === index;
    });
    return {
      month: name,
      netSales: entry ? parseFloat(entry.totalSales) : 0,
    };
  });

  res.status(StatusCodes.OK).json({ netSales: formattedSales });
});

const getSalesPerProduct = asyncWrapper(async (req, res) => {
  const { id: warehouseId } = req.user;

  const sales = await db.OrderItem.findAll({
    include: [
      {
        model: db.Order,
        as: 'order',
        where: {
          warehouseId,
          isPaid: true,
        },
        attributes: []
      },
      {
        model: db.Product,
        as: 'product',
        attributes: ['id', 'name', 'image', 'category']
      }
    ],
    attributes: [
      'productId',
      [db.Sequelize.fn('SUM', db.Sequelize.col('quantity')), 'totalSold']
    ],
    group: ['productId', 'product.id'],
    order: [[db.Sequelize.literal(`SUM("quantity")`), 'DESC']],
    limit: 6
  });

  const formatted = sales.map(item => ({
    productId: item.productId,
    name: item.product?.name,
    image: item.product?.image,
    category: item.product?.category,
    totalSold: parseInt(item.get('totalSold'), 10)
  }));

  res.status(StatusCodes.OK).json({ sales: formatted });
});


module.exports = {
  uploadProfileImage,
  updateProfile,
  getProfile,
  dashboardStats,
  getWarehouseProductStats,
  getNetSalesPerMonth,
  getSalesPerProduct
};
