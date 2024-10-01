const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// User Registration Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check for duplicate email
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create a JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
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

// View User Profile Route
router.get('/profile', auth, (req, res) => {
  res.json({
    msg: `Welcome to your profile, user ${req.user.id}`,
    user: {
      id: req.user.id, // You can return more user details if needed
      name: req.user.name, // Assuming you're attaching name in auth
      email: req.user.email,
      // include any other fields you want to return
    }
  });
});

// Update User Profile Route
router.put('/profile', auth, async (req, res) => {
  const { name, email } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update user details
    user.name = name || user.name; // Only update if new name is provided
    user.email = email || user.email; // Only update if new email is provided

    await user.save(); // Save the updated user
    res.json({ msg: 'User profile updated successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
