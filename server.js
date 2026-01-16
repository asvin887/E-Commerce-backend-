require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const shippingRoute = require('./routes/shippingRoute');
const paymentRoutes = require('./routes/paymentRoutes')

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const uploadRoutes = require('./routes/uploadRoutes');

connectDB();
const app = express();

// 1. Common Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Routes
app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shipping', shippingRoute);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);

// 3. Validation Error Handler (Specific)
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }
  next(err);
});

// 4. General Error Handlers (Catch-all)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));