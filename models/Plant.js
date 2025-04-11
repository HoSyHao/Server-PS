const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    category: String,
    name: String,
    image: String,
    description: String,
    cost: String,
    status: String,
});

module.exports = mongoose.model('Plant', plantSchema);