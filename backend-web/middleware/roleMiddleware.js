// This middleware must run AFTER requireAuth
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      res.status(401);
      throw new Error('Not authorized, user role not found');
    }

    const hasRole = allowedRoles.includes(req.user.role);

    if (!hasRole) {
      res.status(403); // Forbidden
      throw new Error(
        `Forbidden: Role (${req.user.role}) does not have access to this resource`
      );
    }

    next();
  };
};

export { requireRole };