const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashed],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'User registered' });
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, users) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (users.length === 0) return res.status(401).json({ message: 'Invalid email' });

    const valid = await bcrypt.compare(password, users[0].password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: users[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // DEBUG: check if usertype exists
    console.log("User login successful:", users[0]);

    res.status(200).json({
      message: 'Login successful',
      token,
      usertype: users[0].user_type // <- must exist
    });
  });
});
  

module.exports = router;
