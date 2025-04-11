const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors({origin: 'http://localhost:3000'})); 
app.use(express.json());

mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => console.log('MongoDB connection error:', err));

const getPlantRoute = require('./routes/getPlants.js');
const getDetailRoute = require('./routes/getDetail.js');
const addPlantRoute = require('./routes/addPlant.js');
const deletePlantRoute = require('./routes/deletePlant.js');
const updatePlantRoute = require('./routes/updatePlant.js');

app.use("/upload/images", express.static("upload/images"));   

app.use('/api', getPlantRoute);
app.use('/api', getDetailRoute);
app.use('/api', addPlantRoute);
app.use('/api', deletePlantRoute);
app.use('/api', updatePlantRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));