const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user; // Assuming `user` is set by the authMiddleware

    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (user.role !== requiredRole) {
      return res.status(403).json({ error: "Forbidden: You don't have the required permissions" });
    }

    next();
  };
};

module.exports = roleMiddleware;
