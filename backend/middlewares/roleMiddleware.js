// Middleware to check if the user has the correct role
const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    // Extract the user role from the JWT token (assumes user info is in the JWT payload)
    const user = req.user; // Assuming `user` is set by the authMiddleware

    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Check if the user's role matches the required role
    if (user.role !== requiredRole) {
      return res.status(403).json({ error: "Forbidden: You don't have the required permissions" });
    }

    // If the roles match, proceed to the next middleware or controller
    next();
  };
};

module.exports = roleMiddleware;
