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
  },
  {
    name: 'Stomach Pain',
    causes: ['Indigestion', 'Gastritis', 'Food poisoning'],
    remedies: ['Avoid solid food for few hours', 'Drink clear fluids', 'BRAT diet'],
    medicines: ['Antacid (e.g., Gaviscon)', 'Oral rehydration if vomiting/diarrhea'],
    doctorRequired: false
  },
  {
    name: 'Diabetes',
    causes: ['Genetics', 'Obesity', 'Sedentary lifestyle'],
    remedies: ['Balanced diet', 'Exercise regularly', 'Monitor blood sugar'],
    medicines: ['Metformin', 'Insulin'],
    doctorRequired: true
  },
  {
    name: 'Hypertension',
    causes: ['High salt intake', 'Stress', 'Obesity', 'Genetics'],
    remedies: ['Reduce salt', 'Exercise', 'Avoid alcohol and smoking'],
    medicines: ['Amlodipine', 'Losartan'],
    doctorRequired: true
  },
  {
    name: 'Asthma',
    causes: ['Allergens', 'Pollution', 'Genetics'],
    remedies: ['Avoid triggers', 'Breathing exercises'],
    medicines: ['Salbutamol inhaler', 'Fluticasone inhaler'],
    doctorRequired: true
  },
  {
    name: 'Allergy',
    causes: ['Pollen', 'Dust', 'Food', 'Medications'],
    remedies: ['Avoid allergens', 'Antihistamine'],
    medicines: ['Cetirizine', 'Loratadine'],
    doctorRequired: false
  },
  {
    name: 'Back Pain',
    causes: ['Poor posture', 'Muscle strain', 'Injury'],
    remedies: ['Stretching', 'Physical therapy', 'Hot/cold compress'],
    medicines: ['Ibuprofen', 'Paracetamol'],
    doctorRequired: false
  },
  {
    name: 'Chickenpox',
    causes: ['Varicella-zoster virus'],
    remedies: ['Rest', 'Oatmeal baths', 'Keep skin clean'],
    medicines: ['Calamine lotion', 'Paracetamol'],
    doctorRequired: true
  },
  {
    name: 'Migraine',
    causes: ['Hormonal changes', 'Stress', 'Certain foods', 'Sleep issues'],
    remedies: ['Rest in dark room', 'Hydration', 'Cold/Hot compress'],
    medicines: ['Sumatriptan', 'Paracetamol'],
    doctorRequired: true
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