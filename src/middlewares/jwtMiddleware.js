// backend/middleware/jwtMiddleware.js

import jwt from 'jsonwebtoken';

const jwtMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader);  // Log Authorization header
    
    const token = authHeader?.split(' ')[1];  // Extract token from 'Bearer <token>'
    console.log('Extracted Token:', token); // Log the extracted token

    
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
        req.user = decoded;  // Attach the user info to req.user
        next();  // Proceed to the next middleware or controller
    } catch (error) {
        return res.status(400).json({ message: 'Invalid Token' });
    }
};

export default jwtMiddleware;
