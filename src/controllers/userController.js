import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.model.js';  // Assuming you have a User model
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Controller function to get user details from JWT
export const getUserDetails = async (req, res) => {
  try {
    // Get the token from the Authorization header
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;  // Assuming the payload contains { id: userId }
    
    // Validate and cast userId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Fetch user details from the database
    const user = await User.findById(userId).select('-password');  // Exclude password field from the response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user details as response
    res.status(200).json({
      message: 'User details retrieved successfully',
      user
    });
  } catch (error) {
    console.error('Error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.status(500).json({ message: 'Server error', error });
  }
};
