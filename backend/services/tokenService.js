const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const payload = {
    email: user.email,
    role: user.role || 'professor', // Add a default role if it's missing
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

module.exports = { generateToken };
