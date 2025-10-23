const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/symptom_checker';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connection successful to', uri);
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message || err);
    process.exit(1);
  });
