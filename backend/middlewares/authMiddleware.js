const jwt = require('jsonwebtoken');
const { z } = require('zod');

const tokenSchema = z.object({
  email: z.string().email(),
  role: z.string().min(1), // Ensure role is included in the token
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Access Denied. No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. Token missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate decoded token with Zod
    const validatedPayload = tokenSchema.safeParse(decoded);
    if (!validatedPayload.success) {
      return res.status(400).json({ message: 'Invalid Token format.', error: validatedPayload.error.errors });
    }

    req.user = validatedPayload.data; // Attach the validated user info to the request
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token.', error: err.message });
  }
};

module.exports = authMiddleware;
