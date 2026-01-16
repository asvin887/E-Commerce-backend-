// controllers/productController.js

const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');
const { create } = require('../models/userModel');
const createProduct = asyncHandler(async(req, res) => { 
const product = new Product({
  name: 'iPhone 17 Pro Max',
  price: 0,
  user: req.user._id,
  image: '/images/iphone-17-pm-silver-front-back.webp',
  brand: 'Apple',
  category: 'iPhone 17 Seris',
  countInStock: 1,
  numReviews: 0,
  description: 'iPhone 17 Pro Max Silver 256gb'
});

const createdProduct = await product.save();
res.status(201).json(createdProduct);
});

// Fetch all products
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// Fetch single product
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

//Fetch uploaded image files
const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'products', // Organizes images into a folder in Cloudinary
    });
    return result.secure_url; // This is the URL you save to your MongoDB
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
  }
};

module.exports = { getProducts, getProductById, createProduct };