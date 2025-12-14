const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

const authRoutes = require('./routes/auth');
const symptomRoutes = require('./routes/symptoms');
const userRoutes = require('./routes/user');

app.use(cors());
app.use(express.json());



app.use('/api/auth', authRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/user', userRoutes);

const PORT = 5000;
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/symptom_checker';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error', err);
  process.exit(1);
});