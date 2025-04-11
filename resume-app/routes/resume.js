const express = require('express');
const router = express.Router();
const db = require('../db');
const redisClient = require('../redisClient');

// Resume view route (protected)
router.get('/', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const userId = req.session.user.id;
  const cacheKey = `resume:${userId}`;

  try {
    const cachedResume = await redisClient.get(cacheKey);
    if (cachedResume) {
      console.log('🧠 Resume served from cache');
      return res.send(`<h2>Cached Resume</h2><pre>${cachedResume}</pre>`);
    }

    const sql = 'SELECT * FROM resumes WHERE user_id = ?';
    db.query(sql, [userId], async (err, results) => {
      if (err) {
        console.error('MySQL Resume Error:', err);
        return res.status(500).send('Error fetching resume');
      }

      if (results.length > 0) {
        const resumeData = JSON.stringify(results[0], null, 2);
        await redisClient.set(cacheKey, resumeData);
        console.log('💾 Resume fetched from DB and cached');
        res.send(`<h2>Resume</h2><pre>${resumeData}</pre>`);
      } else {
        res.send('📝 No resume found.');
      }
    });
  } catch (e) {
    console.error('Resume error:', e);
    res.status(500).send('Resume error');
  }
});

module.exports = router;
