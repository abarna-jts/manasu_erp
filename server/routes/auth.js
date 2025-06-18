const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

// Register
router.post('/register', async (req, res) => {
  const { email, password, user_type } = req.body;

  try {
    // Step 1: Check if email already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, users) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      if (users.length > 0) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Step 2: Hash password
      const hashed = await bcrypt.hash(password, 10);

      // Step 3: Insert new user
      db.query(
        'INSERT INTO users (email, password, user_type) VALUES (?, ?, ?)',
        [email, hashed, user_type],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Error saving user' });
          res.status(201).json({ message: 'User registered successfully' });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query user by email
    const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const user = users[0];

    // Compare passwords
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Create JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    console.log("User login successful:", user);

    // Send response
    return res.status(200).json({
      message: 'Login successful',
      token,
      usertype: user.user_type
      // username: user.username
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
});



module.exports = router;
