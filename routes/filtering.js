const express = require('express');
const router = express.Router();
const { getNearbyWarehouses } = require('../controllers/filtering');
const authentication = require("../middlewares/authentication");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.route('/warehouses/nearby').get(authentication, authorizeRoles('shop'), getNearbyWarehouses);

module.exports = router;