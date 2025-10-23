const mongoose = require('mongoose');

const SymptomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  causes: [String],
  remedies: [String],
  medicines: [String],
  doctorRequired: { type: Boolean, default: false }
});

module.exports = mongoose.model('Symptom', SymptomSchema);