const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const {sequelize} = require('sequelize');
// Socket.io
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on('join', (roomName) => {
    socket.join(roomName); // ✅ This avoids doubling 'user_'
    console.log(`✅ User joined room: ${roomName}`);
    console.log('📌 Current rooms:', Array.from(socket.rooms));
  });
  
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
app.set('io', io);
require('dotenv').config();
const cors = require('cors');
//middlewares
const errorHandlerMiddleware = require('./middlewares/error-handelr');
const notFound = require('./middlewares/notFound-error')
const authentication = require('./middlewares/authentication')
//routes
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');
const dashboardRouter = require('./routes/dashboard');
const productReviewsRouter = require('./routes/productReviews');
const warehouseReviewsRouter = require('./routes/warehouseReviews');
const trackingWarehouseRouter = require('./routes/tracking');
const chargilyRoutes = require('./routes/chargily');

//
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/webhook', authentication, chargilyRoutes);
app.use(express.json());
//routes
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/auth', authRouter);
app.use('/order', orderRouter);
app.use('/dashboard', dashboardRouter);
//already authenticated
app.use('/productReviews', productReviewsRouter);
app.use('/warehouseReviews', warehouseReviewsRouter);
app.use('/tracking', trackingWarehouseRouter);


//image access 
app.use('/uploads', express.static('uploads'));
//testing
app.get('/test-socket', (req, res) => {
  const io = req.app.get('io');
  const testData = {
    orderId: 999,
    userId: 123,
    totalAmount: 777,
    createdAt: new Date(),
    message: '🧪 Test Order Notification',
  };
  io.to('user_42').emit('order-received-by-shop', testData);
  console.log('📤 Test order emitted to user_37');
  res.send('Test order emitted!');
});

app.get('/', (req, res) => {
  res.send('Hello World');
  
});
app.get('/about', authentication ,(req, res) => {
  res.json({msg: 'Welcome to the about page'});
})

app.use(notFound);
app.use(errorHandlerMiddleware);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});