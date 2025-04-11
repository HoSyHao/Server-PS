const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant.js');

router.delete('/plants/delete', async (req, res) => {
    try {
      const { id } = req.query; 
      const { ids } = req.body; 
  
      if (!id && (!ids || !Array.isArray(ids) || ids.length === 0)) {
        return res.status(400).json({ message: 'Missing id or ids to delete' });
      }
  
      let deletedCount;
  
      if (id) {
        const result = await Plant.deleteOne({ _id: id });
        deletedCount = result.deletedCount;
        if (deletedCount === 0) {
          return res.status(404).json({ message: 'Plant not found' });
        }
      } else if (ids) {
        const result = await Plant.deleteMany({ _id: { $in: ids } });
        deletedCount = result.deletedCount;
        if (deletedCount === 0) {
          return res.status(404).json({ message: 'No plants found to delete' });
        }
      }
  
      res.json({
        message: 'Plants deleted successfully',
        deletedCount: deletedCount,
      });
    } catch (error) {
      console.error('Error deleting plants:', error.stack);
      res.status(500).json({ message: 'Error deleting plants', error: error.message });
    }
  });
  
  module.exports = router;