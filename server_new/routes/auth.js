import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import 'dotenv/config';
import transporter from '../config/mailer.js';
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {

    // Check if email already exists
    const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.query("INSERT INTO users (email, password) VALUES (?,?)", [email, hashed]);

    return res.status(200).json({
      message: "Register Successful",
    });

  }
  catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error during Register' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // ✅ Generate JWT token with 1-hour expiry
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h' // or '7d' for 7 days
    });

    // ✅ Store token in DB
    await db.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

    return res.status(200).json({
      message: 'Login successful',
      token,
      usertype: user.user_type
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
});


router.get('/userDetails', async (req, res) => {
  const query = "SELECT * FROM users WHERE user_type NOT IN (1, 2)";
  try {
    const [result] = await db.query(query);
    if (result.length === 0) {
      return res.status(404).json({ message: "User Details not found" });
    }
    return res.status(200).json({ message: "User Details fetched successfully", data: result });
  } catch (err) {
    console.error("Error fetching User Details:", err);
    res.status(500).json({ message: "Database Error", error: err });
  }
});


router.post('/updateUserType', async (req, res) => {
  const { id, user_type } = req.body;

  if (!id || !user_type) {
    return res.status(400).json({ message: "Missing id or user_type" });
  }

  const query = "UPDATE users SET user_type = ? WHERE id = ?";

  try {
    const [result] = await db.query(query, [user_type, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found or user_type not updated" });
    }

    return res.status(200).json({ message: "User type updated successfully" });
  } catch (err) {
    console.error("Error updating user_type:", err);
    return res.status(500).json({ message: "Database Error", error: err });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  // 1. Generate reset token (valid for 15 minutes)
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

  // 2. Compose reset link
  const resetLink = `${process.env.CLIENT_URL}/#/reset-password/${token}`;

  // 3. Send Email
  try {
    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    return res.status(200).json({ message: "Reset password link sent successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error sending email." });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Replace with your actual DB update logic
    db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Failed to update password" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "Password reset successful." });
    });
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(400).json({ message: "Invalid or expired token." });
  }
});

export default router;
