const express = require('express');
const router = express.Router();
const Symptom = require('../models/Symptom');
const auth = require('../middleware/auth');

// ---------- HEURISTIC RESPONDER ----------
function heuristicResponder(symptom) {
  if (!symptom) return null;
  const s = symptom.toLowerCase();
  const rules = [
    {
      test: /stomach|abdomen|belly|tummy|gastric/i,
      name: 'Stomach Pain',
      causes: ['Indigestion', 'Gastritis', 'Food poisoning'],
      remedies: ['Avoid solid food for a few hours', 'Drink clear fluids', 'BRAT diet'],
      medicines: ['Antacid (e.g., Gaviscon)'],
      doctorRequired: false
    },
    {
      test: /fever|temperature|hot|febrile/i,
      name: 'Fever',
      causes: ['Viral infection', 'Flu'],
      remedies: ['Stay hydrated', 'Rest', 'Cool compresses'],
      medicines: ['Paracetamol 650mg'],
      doctorRequired: true
    },
    {
      test: /cold|congest|sneeze|runny nose/i,
      name: 'Cold',
      causes: ['Common cold (viral)', 'Allergy'],
      remedies: ['Rest', 'Fluids', 'Steam inhalation'],
      medicines: ['Cetirizine'],
      doctorRequired: false
    },
    {
      test: /headache|head pain|migraine/i,
      name: 'Headache',
      causes: ['Tension', 'Dehydration', 'Migraine'],
      remedies: ['Rest in a dark room', 'Hydrate', 'Cold compress'],
      medicines: ['Paracetamol 500mg'],
      doctorRequired: false
    },
    {
      test: /cough|coughing/i,
      name: 'Cough',
      causes: ['Viral infection', 'Allergy', 'Irritant exposure'],
      remedies: ['Warm fluids', 'Honey for adults', 'Steam inhalation'],
      medicines: ['Dextromethorphan (as cough suppressant)'],
      doctorRequired: false
    },
    {
      test: /nausea|vomit|vomiting/i,
      name: 'Nausea',
      causes: ['Food poisoning', 'Gastritis', 'Pregnancy'],
      remedies: ['Small sips of clear fluids', 'Ginger or peppermint'],
      medicines: ['Oral rehydration solutions'],
      doctorRequired: false
    },
    {
      test: /chest pain|heart pain|angina/i,
      name: 'Chest Pain',
      causes: ['Heart attack', 'Angina', 'Muscle strain'],
      remedies: ['Stop activity', 'Call emergency services if severe'],
      medicines: [],
      doctorRequired: true
    },
    {
      test: /diarrhea|loose stool|watery stool/i,
      name: 'Diarrhea',
      causes: ['Food poisoning', 'Viral gastroenteritis', 'Irritable bowel syndrome'],
      remedies: ['Hydrate frequently', 'Eat bland food', 'Avoid dairy'],
      medicines: ['Oral rehydration solution', 'Loperamide if appropriate'],
      doctorRequired: false
    },
    {
      test: /fatigue|tired|exhausted/i,
      name: 'Fatigue',
      causes: ['Lack of sleep', 'Stress', 'Anemia', 'Thyroid issues'],
      remedies: ['Rest', 'Balanced diet', 'Light exercise'],
      medicines: [],
      doctorRequired: false
    },
    {
      test: /dizziness|lightheaded|vertigo/i,
      name: 'Dizziness',
      causes: ['Dehydration', 'Low blood sugar', 'Inner ear issues'],
      remedies: ['Sit or lie down', 'Hydrate', 'Eat something light'],
      medicines: [],
      doctorRequired: true
    },
    {
      test: /rash|itchy skin|hives/i,
      name: 'Skin Rash',
      causes: ['Allergic reaction', 'Infection', 'Irritant exposure'],
      remedies: ['Avoid allergen', 'Cool compress', 'Moisturize'],
      medicines: ['Antihistamines', 'Topical steroid cream'],
      doctorRequired: true
    },
    {
      test: /back pain|lower back|spine pain/i,
      name: 'Back Pain',
      causes: ['Muscle strain', 'Poor posture', 'Herniated disc'],
      remedies: ['Rest', 'Stretching exercises', 'Heat/ice therapy'],
      medicines: ['Paracetamol or Ibuprofen'],
      doctorRequired: false
    },
    {
      test: /sore throat|throat pain/i,
      name: 'Sore Throat',
      causes: ['Viral infection', 'Bacterial infection', 'Irritation'],
      remedies: ['Warm salt water gargle', 'Hydrate', 'Rest voice'],
      medicines: ['Lozenges', 'Paracetamol if needed'],
      doctorRequired: false
    },
    {
      test: /joint pain|knee pain|arthritis/i,
      name: 'Joint Pain',
      causes: ['Arthritis', 'Injury', 'Inflammation'],
      remedies: ['Rest', 'Gentle exercise', 'Ice/heat therapy'],
      medicines: ['Ibuprofen or Paracetamol'],
      doctorRequired: false
    },
    {
      test: /anxiety|nervous|panic/i,
      name: 'Anxiety',
      causes: ['Stress', 'Work pressure', 'Mental health condition'],
      remedies: ['Relaxation techniques', 'Exercise', 'Therapy'],
      medicines: [],
      doctorRequired: false
    },
    {
      test: /insomnia|can't sleep|sleep issues/i,
      name: 'Insomnia',
      causes: ['Stress', 'Irregular schedule', 'Caffeine'],
      remedies: ['Sleep hygiene', 'Limit caffeine', 'Relaxation techniques'],
      medicines: ['Melatonin if needed'],
      doctorRequired: false
    },
    {
      test: /constipation|hard stool/i,
      name: 'Constipation',
      causes: ['Low fiber diet', 'Dehydration', 'Medication side effect'],
      remedies: ['Increase fiber', 'Hydrate', 'Exercise'],
      medicines: ['Laxatives if needed'],
      doctorRequired: false
    },
    {
      test: /shortness of breath|difficulty breathing|breathless/i,
      name: 'Shortness of Breath',
      causes: ['Asthma', 'Pneumonia', 'Heart issues'],
      remedies: ['Sit upright', 'Use inhaler if prescribed', 'Seek medical attention'],
      medicines: [],
      doctorRequired: true
    },
    {
      test: /eye irritation|red eyes|itchy eyes/i,
      name: 'Eye Irritation',
      causes: ['Allergy', 'Dry eyes', 'Infection'],
      remedies: ['Avoid rubbing', 'Lubricating eye drops', 'Cold compress'],
      medicines: [],
      doctorRequired: false
    }
  ];

  for (const r of rules) {
    if (r.test.test(s)) {
      return Object.assign({ source: 'heuristic' }, r);
    }
  }

  return null;
}

// Generic responder: always return a safe, general recommendation when no DB/heuristic match.
function genericResponder(symptom) {
  const s = (symptom || '').toLowerCase();
  // red flags that require doctor/urgent care
  const redFlags = /chest pain|shortness of breath|severe bleeding|unconscious|severe difficulty breathing/i;
  const dangerous = redFlags.test(s);

  // Basic generic buckets
  let causes = ['Unknown — could be many causes'];
  let remedies = ['Rest', 'Stay hydrated', 'Avoid strenuous activity'];
  let medicines = [];
  let doctorRequired = false;

  // If text suggests pain or fever, suggest safe OTC
  if (/fever|temperature|hot|febrile/i.test(s)) {
    causes = ['Infection (viral or bacterial)', 'Inflammation'];
    remedies = ['Rest', 'Hydration', 'Cool compresses'];
    medicines = ['Paracetamol (follow dosage instructions)'];
    doctorRequired = true; // be cautious with fever
  } else if (/pain|ache|achey|sore|hurt/i.test(s)) {
    causes = ['Injury', 'Inflammation', 'Muscle strain', 'Underlying condition'];
    remedies = ['Rest', 'Ice/heat as appropriate', 'Avoid aggravating activities'];
    medicines = ['Paracetamol or Ibuprofen (if no contraindications)'];
  } else if (/nausea|vomit|vomiting/i.test(s)) {
    causes = ['Gastric upset', 'Food poisoning', 'infection'];
    remedies = ['Small sips of clear fluids', 'BRAT diet', 'Rest'];
    medicines = ['Oral rehydration solution'];
  } else if (/cough|cold|congest|sneeze/i.test(s)) {
    causes = ['Viral infection', 'Allergy'];
    remedies = ['Rest', 'Fluids', 'Steam inhalation'];
    medicines = ['Antihistamine or decongestant depending on symptoms'];
  }

  if (dangerous) {
    doctorRequired = true;
    remedies = ['Stop activity and seek immediate medical care'];
    medicines = [];
  }

  return {
    symptom: symptom || 'Unknown',
    causes,
    remedies,
    medicines,
    doctorRequired,
    source: 'generic',
    message: 'General guidance (not a substitute for medical advice). If symptoms are severe or worsening, seek medical care.'
  };
}

// POST /api/symptoms/check
// body: { symptom: 'headache' }
router.post('/check', auth, async (req, res) => {
  try {
    const { symptom } = req.body;
    if (!symptom) return res.status(400).json({ message: 'Symptom required' });
    // Try exact match first, then substring match for suggestions
    let found = await Symptom.findOne({ name: new RegExp('^' + symptom + '$', 'i') });
    if (!found) {
      // try substring match
      found = await Symptom.findOne({ name: new RegExp(symptom, 'i') });
    }

    // If still not found, attempt fuzzy match (Levenshtein similarity)
    if (!found) {
      const all = await Symptom.find({}).select('name');
      const names = all.map(s => s.name || '');

      // simple Levenshtein distance
      function levenshtein(a, b) {
        const m = a.length, n = b.length;
        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        for (let i = 1; i <= m; i++) {
          for (let j = 1; j <= n; j++) {
            const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
          }
        }
        return dp[m][n];
      }

      let best = { name: null, score: 0 };
      for (const n of names) {
        const dist = levenshtein(symptom.trim().toLowerCase(), n.trim().toLowerCase());
        const maxLen = Math.max(symptom.length, n.length) || 1;
        const similarity = 1 - dist / maxLen; // 0..1
        if (similarity > best.score) best = { name: n, score: similarity };
      }

      // threshold for suggestion
      if (best.score >= 0.6 && best.name) {
        // return the suggested match to the client
        const suggested = await Symptom.findOne({ name: best.name });
        if (req.user) {
          req.user.healthHistory.push({ symptom: suggested.name, result: suggested });
          await req.user.save();
        }
        return res.json({
          symptom: suggested.name,
          causes: suggested.causes,
          remedies: suggested.remedies,
          medicines: suggested.medicines,
          doctorRequired: suggested.doctorRequired,
          suggested: true,
          suggestionScore: best.score,
          message: `Showing closest match: ${suggested.name}`
        });
      }

      // Try heuristic responder before returning not-found
      const heur = heuristicResponder(symptom);
      if (heur) {
        if (req.user) {
          req.user.healthHistory.push({ symptom: heur.name, result: heur });
          await req.user.save();
        }
        return res.json({
          symptom: heur.name,
          causes: heur.causes,
          remedies: heur.remedies,
          medicines: heur.medicines,
          doctorRequired: heur.doctorRequired,
          message: 'Heuristic suggestion (not from DB)',
          heuristic: true
        });
      }

      // Fall back to generic responder when nothing else matched
      const g = genericResponder(symptom);
      if (req.user) {
        req.user.healthHistory.push({ symptom: g.symptom, result: g });
        await req.user.save();
      }
      return res.json(g);
    }

    // Save to user history
    if (req.user) {
      req.user.healthHistory.push({ symptom: found.name, result: found });
      await req.user.save();
    }

    res.json({
      symptom: found.name,
      causes: found.causes,
      remedies: found.remedies,
      medicines: found.medicines,
      doctorRequired: found.doctorRequired
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public endpoint for symptom check (no auth) - useful for quick dev/testing
router.post('/check-public', async (req, res) => {
  try {
    const { symptom } = req.body;
    if (!symptom) return res.status(400).json({ message: 'Symptom required' });

    // Try exact match first, then substring match
    let found = await Symptom.findOne({ name: new RegExp('^' + symptom + '$', 'i') });
    if (!found) found = await Symptom.findOne({ name: new RegExp(symptom, 'i') });
    if (!found) {
      const heur = heuristicResponder(symptom);
      if (heur) {
        return res.json({
          symptom: heur.name,
          causes: heur.causes,
          remedies: heur.remedies,
          medicines: heur.medicines,
          doctorRequired: heur.doctorRequired,
          message: 'Heuristic suggestion (not from DB)',
          heuristic: true
        });
      }
      const g = genericResponder(symptom);
      return res.json(g);
    }

    res.json({
      symptom: found.name,
      causes: found.causes,
      remedies: found.remedies,
      medicines: found.medicines,
      doctorRequired: found.doctorRequired
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// Public endpoint to list all symptoms (for debugging / UI autocomplete)
// GET /api/symptoms/all
router.get('/all', async (req, res) => {
  try {
    const list = await Symptom.find({}).select('-__v');
    res.json({ count: list.length, symptoms: list });
  } catch (err) {
    console.error('Error fetching symptoms list', err);
    res.status(500).json({ message: 'Server error' });
  }
});


