const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')

// Load environment variables
require('dotenv') 

// Register new user
router.post('/register', async (req, res) => {
  // const { name, email, password, role } = req.body;
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password
      // role
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Generate JWT
    const payload = {
      user: {
        id: user.id
        // role: user.role
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          console.error('JWT signing error:', err);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          console.log('Generated JWT token:', token); // Log the generated token
          res.json({ token }); // Send the token in the response

          // Send verification email
          const transporter = nodemailer.createTransport({
            host: 'smtp.mail.me.com',
            port: 587,
            secure: false,
            tls: {
              rejectUnauthorized: false // Add this line to disable SSL verification
            },
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Email Verification',
            text: `Please verify your email by clicking the following link: https://flexworkspace-backend.onrender.com/api/auth/verify-email?token=${token}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        }
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Verify email
router.get('/verify-email', async (req, res) => {
  const token = req.query.token;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and update verification status
    let user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid token' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).send('Email verified successfully');

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Check if password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Check if user is verified
      if (!user.isVerified) {
          return res.status(400).json({ msg: 'Email not verified' });
      }

      // Generate JWT with user ID and role
      const payload = {
          user: {
              id: user.id
              // role: user.role // Include user's role in the payload
          }
      };
      jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 360000 },
          (err, token) => {
              if (err) throw err;
              res.json({ token });
          }
      );

  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

// Fetch user information (avatar name)
router.get('/user', authMiddleware, async (req, res) => {
  try {
    // Fetch user information based on the user ID extracted from the authentication token
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Return user information
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
})

module.exports = router;