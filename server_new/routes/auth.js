import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import nodemailer from 'nodemailer';
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
    console.log("enter")
    const { email, password } = req.body;

    try {
        // Query user by email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: "sivakumarb3928@gmail.com",
      pass: "sqwy eleh iunc cjsu"
  }
});

//changed by sivakumar
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
 
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
 
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
 
      if (result.length === 0) {
        return res.status(404).json({ message: "Email not registered" });
      }
 
      const newPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
 
      db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], async (updateErr) => {
        if (updateErr) return res.status(500).json({ message: "Failed to reset password" });
 
        const mailOptions = {
          from: 'sivakumarb3928@gmail.com',
          to: email,
          subject: 'Your Password Has Been Reset',
          html: `<p>Your new password is: <b>${newPassword}</b></p><p>Please change it after logging in.</p>`
        };
 
        try {
          await transporter.sendMail(mailOptions);
          return res.status(200).json({ message: "Password reset email sent successfully" });
        } catch (mailErr) {
          console.error("Email sending error:", mailErr);
          return res.status(500).json({ message: "Password updated but failed to send email" });
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



export default router;
