const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserDetails,
  updateUserDetails,
  deleteUser,
} = require("../controllers/admin");
const authentication = require("../middlewares/authentication");
const authorizeRoles = require("../middlewares/authorizeRoles");

const auths = [ authentication, authorizeRoles("admin") ];
router.route("/").get(...auths, getAllUsers);
router.route("/:id").get(...auths, getUserDetails).patch(...auths, updateUserDetails).delete(...auths, deleteUser);

module.exports = router;