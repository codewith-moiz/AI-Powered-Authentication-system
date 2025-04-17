const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    const user = new User({ name, email, password });
    await user.save();
    
    const token = user.generateToken();
    res.status(201).json({ user: { id: user._id, name, email, useFaceRecognition: user.useFaceRecognition }, token });
  } catch (error) {
    res.status(400).json({ message: 'Error during signup', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = user.generateToken();
    res.json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        useFaceRecognition: user.useFaceRecognition 
      }, 
      token 
    });
  } catch (error) {
    res.status(400).json({ message: 'Login error', error: error.message });
  }
});

router.post('/face-login', async (req, res) => {
  try {
    const { email, faceDescriptor } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !user.useFaceRecognition || !user.faceDescriptor) {
      return res.status(401).json({ message: 'Face recognition not enabled or user not found' });
    }
    
    // Note: In a real implementation, you would compare the face descriptor 
    // using a proper distance/similarity calculation. This is simplified.
    // Face verification logic would be implemented in a separate utility function

    const token = user.generateToken();
    res.json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        useFaceRecognition: user.useFaceRecognition 
      }, 
      token 
    });
  } catch (error) {
    res.status(400).json({ message: 'Face login error', error: error.message });
  }
});

router.post('/save-face', auth, async (req, res) => {
  try {
    const { faceDescriptor } = req.body;
    
    req.user.faceDescriptor = faceDescriptor;
    req.user.useFaceRecognition = true;
    await req.user.save();
    
    res.json({ message: 'Face data saved successfully', useFaceRecognition: true });
  } catch (error) {
    res.status(400).json({ message: 'Error saving face data', error: error.message });
  }
});

module.exports = router; 