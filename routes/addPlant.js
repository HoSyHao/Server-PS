const express = require('express');
const router = express.Router();
const multer = require('multer');
const Plant = require('../models/Plant');

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Giữ nguyên tên file
  },
});
const upload = multer({ storage });

// Route POST để thêm plant
router.post('/plants/add', upload.single('image'), async (req, res) => {
  try {
    // Log req.body và req.file để kiểm tra dữ liệu nhận được
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    const { category, name, description, cost, status } = req.body;
    const image = req.file ? req.file.filename : null; // Chỉ lấy tên file từ upload

    // Kiểm tra dữ liệu đầu vào
    if (!category || !name || !description || !cost) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Tạo plant mới
    const newPlant = new Plant({
      category,
      name,
      image,
      description,
      cost,
      status,
    });

    // Lưu vào database
    const savedPlant = await newPlant.save();

    // Trả về document đầy đủ
    res.status(201).json(savedPlant);
  } catch (error) {
    console.error('Error adding plant:', error);
    res.status(500).json({ message: 'Error adding plant', error: error.message });
  }
});

module.exports = router;