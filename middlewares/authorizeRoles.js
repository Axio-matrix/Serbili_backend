// middlewares/authorizeRoles.js
const { ForbiddenError } = require('../errors');

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.userType)) {
      throw new ForbiddenError('You are not authorized to perform this action');
    }
    next();
  };
};

module.exports = authorizeRoles;
