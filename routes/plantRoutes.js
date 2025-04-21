const express = require('express');
const router = express.Router();
const PlantController = require('../controllers/PlantController');
const verifyToken = require('../middlewares/auth');

router.get('/next-id', verifyToken, PlantController.getNextId);
router.post('/add', verifyToken, PlantController.addPlant);
router.delete('/delete', verifyToken, PlantController.deletePlants);
router.get('/detail/:id', verifyToken, PlantController.getPlantDetail);
router.get('/', verifyToken, PlantController.getPlants);
router.put('/update/:id', verifyToken, PlantController.updatePlant);

module.exports = router;