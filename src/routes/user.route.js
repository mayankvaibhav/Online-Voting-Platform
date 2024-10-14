// routes/user.js
import express from 'express';
import { User } from '../models/User.model.js'; // Adjust the import path
import jwt from 'jsonwebtoken';

const userRoutes = express.Router();

// User registration
// userRoutes.post('/register', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const newUser = new User({ username, password });
//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error registering user', error });
//   }
// });


// User registration
userRoutes.post('/register', async (req, res) => {
  const { username, email, password, profile } = req.body; // Include email

  try {
    const newUser = new User({ username, email, password, profile }); // Pass email to the User model
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});


// User login
userRoutes.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Log the incoming request
    console.log("Login attempt for username:", username);

    // Find the user by username
    const user = await User.findOne({ username });
    console.log("User found:", user ? user.username : "No user found");

    // If user is not found, return a 401 response
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials: User not found' });
    }

    // Log the password being compared
    console.log("Password provided:", password);
    console.log("Hashed password from DB:", user.password);

    // Check if the provided password is correct
    const isMatch = await user.isPasswordCorrect(password);  // Assuming your User model has a method to check passwords

    if (isMatch) {
      // Use the toJSON method to get the user details without the password
      const userDetails = user.toJSON();

      // Generate a JWT token that includes user details
      const token = jwt.sign(
        {
          id: userDetails._id,
          username: userDetails.username,
          email: userDetails.email,
          profile: userDetails.profile,
          role: userDetails.role, // Include role
          isVerified: userDetails.isVerified // Include verification status
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      // Log the token for debugging
      console.log("Generated Token:", token);

      // Send a success response with the token and user details
      return res.status(200).json({ 
        message: 'Login successful', 
        token,
        user: userDetails // Return user details without the password
      });

    } else {
      // Handle incorrect password logic
      console.log('Incorrect password');
      return res.status(401).json({ 
        message: 'Invalid credentials: Password is incorrect' 
      });
    }

  } catch (error) {
    // Log any errors and return a 500 response
    console.error("Login error:", error);
    return res.status(500).json({ message: 'Error logging in', error: error.message || error });
  }
});





// Get user profile (authenticated route)
userRoutes.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.id).select('-password'); // Exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
});


export default userRoutes;
