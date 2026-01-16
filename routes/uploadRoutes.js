const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// 1. Setup Multer temporary storage
const storage = multer.diskStorage({});
const upload = multer({ storage });

// 2. The Upload Logic
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // Upload to Cloudinary using the temporary file path
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'products', // Optional: organizes images in Cloudinary
    });

    // Return the secure URL to the frontend
    res.json({
      message: 'Image uploaded successfully',
      url: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ message: 'Cloudinary Upload Failed', error: error.message });
  }
});

module.exports = router;