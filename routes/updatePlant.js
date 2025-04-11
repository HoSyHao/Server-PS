const express = require('express');
const router = express.Router();
const multer = require('multer');
const Plant = require('../models/Plant'); // Giả định bạn có model Plant
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Giữ nguyên tên file gốc từ client
  },
});

const upload = multer({ storage: storage });

// Route PUT
router.put('/plants/update/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cost, category, status, description } = req.body;
    const image = req.file ? req.file.filename : req.body.image; // Cập nhật plant.image với tên file mới

    const existingPlant = await Plant.findOne({
      name: name,
      category: category,
      _id: { $ne: id },
    });

    if (existingPlant) {
      return res.status(400).json({
        message: `A plant with name "${name}" already exists in category "${category}".`,
      });
    }

    const updatedPlant = await Plant.findByIdAndUpdate(
      id,
      {
        name,
        cost,
        category,
        status,
        description,
        image,
      },
      { new: true }
    );

    if (!updatedPlant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.json(updatedPlant);
  } catch (error) {
    res.status(500).json({ message: 'Error updating plant', error: error.message });
  }
});

module.exports = router;