const express = require('express');
const router = express.Router();

router.post('/recommend', async (req, res) => {
  res.json({ message: 'recommend route coming soon' });
});

module.exports = router;