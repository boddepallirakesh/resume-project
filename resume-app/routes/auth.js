const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db');
const amqplib = require('amqplib');

// Serve login page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

// Serve register page
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/register.html'));
});

// Handle registration
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const checkUserSql = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUserSql, [email], async (err, results) => {
    if (err) {
      console.error('MySQL Error:', err);
      return res.status(500).send('Database error');
    }

    if (results.length > 0) {
      return res.send('⚠️ User already registered. Please login.');
    }

    const insertSql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(insertSql, [email, password], async (err) => {
      if (err) {
        console.error('MySQL Insert Error:', err);
        return res.status(500).send('Registration failed');
      }

      try {
        const conn = await amqplib.connect(process.env.RABBITMQ_URL);
        const ch = await conn.createChannel();
        const q = 'emailQueue';
        await ch.assertQueue(q);
        ch.sendToQueue(q, Buffer.from(email));
        console.log(`📧 Sent welcome email job for ${email}`);
      } catch (mqErr) {
        console.error('RabbitMQ Error:', mqErr);
      }

      res.redirect('/login');
    });
  });
});

// Handle login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('MySQL Error:', err);
      return res.status(500).send('Database error');
    }

    if (results.length > 0) {
      req.session.user = results[0];
      res.redirect('/resume');
    } else {
      res.send('❌ Invalid credentials or user not registered');
    }
  });
});

module.exports = router;
