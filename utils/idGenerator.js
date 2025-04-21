const Plant = require('../models/Plant');

const generatePlantId = async (category) => {
  console.log(`Generating ID for category: ${category}`);
  const categoryCodeMap = {
    'Air Purifying Plants': 'APP',
    'Aromatic Fragrant Plants': 'AFP',
    'Insect Repellent Plants': 'IRP',
    'Medicinal Plants': 'MCP',
    'Low Maintenance Plants': 'LMP',
  };

  const categoryCode = categoryCodeMap[category] || 'UNKNOWN';
  const prefix = `PLANT${categoryCode}`;

  const lastPlant = await Plant.findOne({ category })
    .sort({ id: -1 })
    .select('id');

  let nextNumber = 1;
  if (lastPlant && lastPlant.id) {
    const match = lastPlant.id.match(/(\d+)$/);
    if (match) {
      nextNumber = parseInt(match[0], 10) + 1;
    }
  }

  while (true) {
    const newId = `${prefix}${nextNumber.toString().padStart(4, '0')}`;
    const existingPlant = await Plant.findOne({ id: newId });
    if (!existingPlant) {
      return newId;
    }
    nextNumber++;
  }
};

module.exports = { generatePlantId };