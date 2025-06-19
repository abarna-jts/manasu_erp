const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email already exists
    const [existingUsers] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.promise().query("INSERT INTO users (email, password) VALUES (?,?)", [email, hashed]);

    return res.status(200).json({
      message: "Register Successful",
    });

  }
  catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error during Register' });
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
