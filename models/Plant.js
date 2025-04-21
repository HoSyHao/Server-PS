const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String, required: true },
  cost: { type: String, required: true },
  status: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Plant', plantSchema);