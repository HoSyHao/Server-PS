const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant.js');

router.get('/plants/:id', async (req, res) => {
    try {
      const plant = await Plant.findById(req.params.id);
      if (!plant) return res.status(404).json({ message: 'Plant not found' });
      res.json(plant);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  module.exports = router;