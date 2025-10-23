const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/user/history
router.get('/history', auth, async (req, res) => {
  try {
    const history = req.user.healthHistory || [];
    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;