require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
