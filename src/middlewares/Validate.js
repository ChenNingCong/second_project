import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // Everything is fine, move to the controller
  }
  
  // If there are errors, stop here and respond
  return res.status(422).json({
    errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
  });
};