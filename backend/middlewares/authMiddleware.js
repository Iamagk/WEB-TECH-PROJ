const jwt = require('jsonwebtoken');
const { z } = require('zod');
const tokenSchema = z.object({
  email: z.string().email(),
});

const authenticate = (req, res, next) => {
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

    req.professor = validatedPayload.data; // Attach the validated professor info to the request
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token.', error: err.message });
  }
};

module.exports = authenticate;
