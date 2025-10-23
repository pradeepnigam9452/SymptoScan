const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Symptom = require('./models/Symptom');

dotenv.config();

const data = [
  {
    name: 'Headache',
    causes: ['Dehydration', 'Stress'],
    remedies: ['Drink water', 'Rest'],
    medicines: ['Paracetamol 500mg'],
    doctorRequired: false
  },
  {
    name: 'Fever',
    causes: ['Viral infection', 'Flu'],
    remedies: ['Warm fluids', 'Rest'],
    medicines: ['Paracetamol 650mg'],
    doctorRequired: true
  },
  {
    name: 'Cold',
    causes: ['Allergy', 'Viral infection'],
    remedies: ['Steam inhalation', 'Vitamin C'],
    medicines: ['Cetirizine'],
    doctorRequired: false
  }
  ,{
    name: 'Stomach Pain',
    causes: ['Indigestion', 'Gastritis', 'Food poisoning'],
    remedies: ['Avoid solid food for few hours', 'Drink clear fluids', 'BRAT diet'],
    medicines: ['Antacid (e.g., Gaviscon)', 'Oral rehydration if vomiting/diarrhea'],
    doctorRequired: false
  }
];

async function seed() {
  await mongoose.connect( 'mongodb://localhost:27017/symptom_checker');
  // If an old index or legacy field exists (e.g., symptomName) it can cause duplicate key errors.
  // Drop the index if present, then clear and insert fresh data.
  try {
    const collection = mongoose.connection.collection('symptoms');
    // attempt to drop the legacy index by name (silently continue if it doesn't exist)
    const indexes = await collection.indexes();
    const hasLegacy = indexes.some(ix => ix.name === 'symptomName_1');
    if (hasLegacy) {
      await collection.dropIndex('symptomName_1');
      console.log('Dropped legacy index symptomName_1');
    }
  } catch (e) {
    console.log('No legacy index to drop or drop failed, continuing...', e.message);
  }

  await Symptom.deleteMany({});
  await Symptom.insertMany(data);
  console.log('Seeded symptoms');
  Symptom.db.close();
 
}

seed().catch(err => { console.error(err); });