const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const plantRoutes = require('./routes/plantRoutes');
const fs = require('fs');
const path = require('path');

dotenv.config();

const uploadDir = path.join(__dirname, 'upload', 'images');
fs.mkdir(uploadDir, { recursive: true }, (err) => {
  if (err) {
    console.error('Error creating upload/images directory:', err);
  } else {
    console.log('upload/images directory is ready');
  }
});

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);

app.use('/uploads', express.static('upload'));

mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));