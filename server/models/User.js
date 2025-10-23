const mongoose = require('mongoose');

const HealthHistorySchema = new mongoose.Schema({
  symptom: String,
  result: Object,
  checkedAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  healthHistory: [HealthHistorySchema]
});

module.exports = mongoose.model('User', UserSchema);