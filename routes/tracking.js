const express = require('express');
const router = express.Router();
const { updateOrderStatus, notifyWarehouseOrderReceived } = require('../controllers/tracking');
const authentication = require('../middlewares/authentication');
const authorizeRoles = require('../middlewares/authorizeRoles');

router.route('/:id').patch(authentication, authorizeRoles('warehouse'), updateOrderStatus);
router.route('/notify-warehouse/:id').post(authentication, authorizeRoles('shop'), notifyWarehouseOrderReceived);

module.exports = router;
