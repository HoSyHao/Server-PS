const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant.js');

router.get('/plants', async (req, res) => {
  const { page = 1, pageSize = 6, category, sort } = req.query;
  const query = category && category !== 'All' ? { category } : {}; // Xử lý category 'All'

  try {
    const total = await Plant.countDocuments(query);

    if (sort === 'priceAsc' || sort === 'priceDesc') {
      const sortDirection = sort === 'priceAsc' ? 1 : -1;

      const plants = await Plant.aggregate([
        { $match: query },
        {
          $addFields: {
            numericCost: {
              $toDouble: { $substrCP: ['$cost', 1, { $strLenCP: '$cost' }] }, // Tách từ ký tự thứ 2 (bỏ $)
            },
          },
        },
        { $sort: { numericCost: sortDirection } },
        { $skip: (page - 1) * pageSize },
        { $limit: parseInt(pageSize) },
        { $project: { numericCost: 0 } }, // Loại bỏ trường tạm
      ]);

      res.json({
        plants,
        total,
        page: parseInt(page),
        hasNextPage: page * pageSize < total,
      });
    } else {
      const plants = await Plant.find(query)
        .skip((page - 1) * pageSize)
        .limit(parseInt(pageSize));

      res.json({
        plants,
        total,
        page: parseInt(page),
        hasNextPage: page * pageSize < total,
      });
    }
  } catch (error) {
    console.error('Error fetching plants:', error.stack); // Log stack trace
    res.status(500).json({ message: 'Error fetching plants', error: error.message });
  }
});

module.exports = router;