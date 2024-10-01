const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Use optional chaining to prevent errors

  // Check if there is no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach user data to the request object
    next(); // Pass control to the next middleware
  } catch (err) {
    console.error("JWT Verification Error:", err.message); // Log the error message
    res.status(401).json({ msg: 'Token is not valid' }); // Send response if token is invalid
  }
}

module.exports = auth;
