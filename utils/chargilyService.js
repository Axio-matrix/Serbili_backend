const { ChargilyClient } = require("@chargily/chargily-pay");
require("dotenv").config();

const client = new ChargilyClient({
  api_key: process.env.CHARGILY_API_KEY,
  mode: "test", // 'test' or 'live'
});

const createPayment = async ({
  amount,
  email,
  name,
  method,
  orderId,
  items,
  phone,
}) => {
  const customer = await client.createCustomer({
    name,
    email,
    phone,
    address: {
      country: "DZ",
    },
    metadata: { orderId },
  });

  const checkoutItems = [];

  for (const item of items) {
    try {
      const product = await client.createProduct({
        name: item.name,
        description: item.description || "No description",
        metadata: {
          productId: String(item.id), // make sure it's a string
        },
      });

      const price = await client.createPrice({
        amount: Math.round(item.price),
        currency: "dzd",
        product_id: product.id,
      });

      checkoutItems.push({
        price: price.id,
        quantity: item.quantity,
      });
    } catch (error) {
      console.error("❌ Error in item loop:", item, error.message);
    }
  }

  const checkout = await client.createCheckout({
    items: checkoutItems,
    success_url: `${process.env.BASE_URL}/payment/success`,
    failure_url: `${process.env.BASE_URL}/payment/failure`,
    payment_method: method.toLowerCase(), // edahabia / cib
    customer_id: customer.id,
    metadata: { order_id: orderId },
    collect_shipping_address: true,
    pass_fees_to_customer: true,
  });

  return checkout;
};

module.exports = {
  createPayment,
};
