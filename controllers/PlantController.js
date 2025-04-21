const Plant = require('../models/Plant');
const multer = require('multer');
const { generatePlantId } = require('../utils/idGenerator');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const getNextId = async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
    const nextId = await generatePlantId(category);
    res.json({ id: nextId });
  } catch (error) {
    console.error('Error fetching next ID:', error);
    res.status(500).json({ message: 'Error fetching next ID', error: error.message });
  }
};

const addPlant = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { category, name, description, cost, status } = req.body;
      const image = req.file ? req.file.filename : null;

      if (!category || !name || !description || !cost) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const existingPlant = await Plant.findOne({ name, category });
      if (existingPlant) {
        return res.status(400).json({
          message: `A plant with name "${name}" already exists in category "${category}".`,
        });
      }

      const id = await generatePlantId(category);
      const existingPlantById = await Plant.findOne({ id });
      if (existingPlantById) {
        return res.status(400).json({ message: 'Generated ID already exists' });
      }

      const newPlant = new Plant({
        id,
        category,
        name,
        image,
        description,
        cost,
        status,
        updatedAt: new Date(),
      });

      const savedPlant = await newPlant.save();
      res.status(201).json(savedPlant);
    } catch (error) {
      console.error('Error adding plant:', error);
      res.status(500).json({ message: 'Error adding plant', error: error.message });
    }
  },
];

const deletePlants = async (req, res) => {
  try {
    const { id } = req.query;
    const { ids } = req.body;

    if (!id && (!ids || !Array.isArray(ids) || ids.length === 0)) {
      return res.status(400).json({ message: 'Missing id or ids to delete' });
    }

    let deletedCount;

    if (id) {
      const result = await Plant.deleteOne({ id: id });
      deletedCount = result.deletedCount;
      if (deletedCount === 0) {
        return res.status(404).json({ message: 'Plant not found' });
      }
    } else if (ids) {
      const result = await Plant.deleteMany({ id: { $in: ids } });
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
};

const getPlantDetail = async (req, res) => {
  try {
    const plant = await Plant.findOne({ id: req.params.id });
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    res.json(plant);
  } catch (error) {
    console.error('Error fetching plant:', error);
    res.status(500).json({ message: 'Error fetching plant', error: error.message });
  }
};

const getPlants = async (req, res) => {
  const { page = 1, pageSize = 6, category, sort, search } = req.query;
  const pageNum = parseInt(page);
  const pageSizeNum = parseInt(pageSize);

  const query = {};
  if (category && category !== 'All') {
    query.category = category;
  }
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  try {
    const total = await Plant.countDocuments(query);

    if (sort === 'priceAsc' || sort === 'priceDesc') {
      const sortDirection = sort === 'priceAsc' ? 1 : -1;

      const plants = await Plant.aggregate([
        { $match: query },
        {
          $addFields: {
            numericCost: {
              $toDouble: { $substrCP: ['$cost', 1, { $strLenCP: '$cost' }] },
            },
          },
        },
        { $sort: { numericCost: sortDirection, updatedAt: -1, _id: -1 } },
        { $skip: (pageNum - 1) * pageSizeNum },
        { $limit: pageSizeNum },
        { $project: { numericCost: 0 } },
      ]);

      res.json({
        plants,
        total,
        page: pageNum,
        hasNextPage: pageNum * pageSizeNum < total,
      });
    } else {
      const sortOption = { updatedAt: -1, _id: -1 };
      const plants = await Plant.find(query)
        .sort(sortOption)
        .skip((pageNum - 1) * pageSizeNum)
        .limit(pageSizeNum);

      res.json({
        plants,
        total,
        page: pageNum,
        hasNextPage: pageNum * pageSizeNum < total,
      });
    }
  } catch (error) {
    console.error('Error fetching plants:', error.stack);
    res.status(500).json({ message: 'Error fetching plants', error: error.message });
  }
};

const updatePlant = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, cost, category, status, description } = req.body;
      const image = req.file ? req.file.filename : req.body.image;

      const currentPlant = await Plant.findOne({ id });
      if (!currentPlant) {
        return res.status(404).json({ message: 'Plant not found' });
      }

      const existingPlant = await Plant.findOne({
        name: name,
        category: category,
        id: { $ne: id },
      });

      if (existingPlant) {
        return res.status(400).json({
          message: `A plant with name "${name}" already exists in category "${category}".`,
        });
      }

      let newId = id;
      if (category !== currentPlant.category) {
        newId = await generatePlantId(category);
        const idExists = await Plant.findOne({ id: newId });
        if (idExists) {
          return res.status(400).json({ message: `Generated ID "${newId}" already exists` });
        }
      }

      const updatedPlant = await Plant.findOneAndUpdate(
        { id: id },
        {
          id: newId,
          name,
          cost,
          category,
          status,
          description,
          image,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!updatedPlant) {
        return res.status(404).json({ message: 'Plant not found' });
      }

      res.json(updatedPlant);
    } catch (error) {
      console.error('Error updating plant:', error);
      res.status(500).json({ message: 'Error updating plant', error: error.message });
    }
  },
];

module.exports = {
  getNextId,
  addPlant,
  deletePlants,
  getPlantDetail,
  getPlants,
  updatePlant,
};