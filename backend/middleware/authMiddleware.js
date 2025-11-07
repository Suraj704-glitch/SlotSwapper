import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import 'dotenv/config';

// This function will be added to any route we want to protect
const protect = async (req, res, next) => {
  let token;

  // Check if the auth header is present and formatted correctly
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using your secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID from the token
      // .select('-password') ensures we don't attach the hashed password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Move on to the next function (the controller)
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };