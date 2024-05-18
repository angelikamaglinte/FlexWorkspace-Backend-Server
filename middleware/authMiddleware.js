// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const verifyToken = (req, res, next) => {
//   // Get the token from the request headers
//   const token = req.header('x-auth-token');

//   // Check if token exists
//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach user ID and role to the request object
//     req.user = decoded.user;

//     // Call the next middleware
//     next();
//   } catch (err) {
//     return res.status(401).json({ msg: 'Token is not valid' });
//   }
// };

// module.exports = verifyToken;

// authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // Get the token from the request headers
  const token = req.header('x-auth-token');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database using user ID from decoded token
    const user = await User.findById(decoded.user.id).select('-password');

    // Check if user exists
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    // Attach user object to the request object
    req.user = user;

    // Call the next middleware
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
