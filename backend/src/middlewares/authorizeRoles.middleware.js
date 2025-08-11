import { ApiError } from "../utils/ApiError.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      // This means verifyJWT middleware did not run or failed
      return next(new ApiError(401, "Unauthorized: No user info"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden: Insufficient role"));
    }

    next();
  };
};
