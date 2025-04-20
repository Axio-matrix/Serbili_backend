const express = require('express');
const router = express.Router();
const { verifySignature } = require('@chargily/chargily-pay');
const {
  BadRequestError,
  UnauthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("../errors");
const db = require('../db/models')
router.post('/', express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString(); // make sure it's string
  }
}), async (req, res) => {
  const signature = req.get('signature') || '';
  const payload = req.rawBody;

  if (!verifySignature(payload, signature, process.env.CHARGILY_API_KEY)) {
    return res.sendStatus(403);
  }

  const event = req.body;
  console.log('💰 Webhook received:', event);

  // Extract the order_id from metadata
  const orderId = event.data.metadata.order_id;

  // Check if the status is "paid"
  if (event.type === 'checkout.paid' && event.data.status === 'paid') {
    try {
      // Update the order status to 'paid' in the database
      const order = await db.Order.findByPk(orderId);
      if (!order) {
        throw new NotFoundError('Order not found');
      }

      order.isPaid = true;  // 
      await order.save();

      console.log(`Order ${orderId} marked as paid`);

      // Emit the payment status to the warehouse before responding
      const io = req.app.get('io');
      io.to(`user_${order.warehouseId}`).emit('order-paid', {
        orderId,
        message: 'An order has been marked as paid!',
      });

      // Now send the response to confirm the webhook was processed successfully
      return res.sendStatus(200); // Successfully handled the webhook
    } catch (error) {
      console.error('Error updating order status:', error.message);
      return res.sendStatus(500); // Internal server error
    }
  } else {
    // If the status is not "paid", just respond with 200 to acknowledge the webhook
    return res.sendStatus(200);
  }
});

module.exports = router;