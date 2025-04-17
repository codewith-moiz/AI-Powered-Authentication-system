const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
  try {
    res.json({ 
      user: { 
        id: req.user._id, 
        name: req.user.name, 
        email: req.user.email, 
        useFaceRecognition: req.user.useFaceRecognition 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'password'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    
    res.json({ 
      user: { 
        id: req.user._id, 
        name: req.user.name, 
        email: req.user.email, 
        useFaceRecognition: req.user.useFaceRecognition 
      } 
    });
  } catch (error) {
    res.status(400).json({ message: 'Update error', error: error.message });
  }
});

router.delete('/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete error', error: error.message });
  }
});

router.post('/disable-face-recognition', auth, async (req, res) => {
  try {
    req.user.faceDescriptor = null;
    req.user.useFaceRecognition = false;
    await req.user.save();
    
    res.json({ message: 'Face recognition disabled', useFaceRecognition: false });
  } catch (error) {
    res.status(400).json({ message: 'Error disabling face recognition', error: error.message });
  }
});

module.exports = router; 