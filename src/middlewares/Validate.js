import { validationResult } from "express-validator";
import { ValidationError } from "../utils/error.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // Everything is fine, move to the controller
  }
  
  const errorList = errors.array()
  .map(err => `• ${err.path}: ${err.msg}`)
  .join('\n');

  const message = `Validation failed. Please check the following:\n${errorList}`;
  next(new ValidationError(message));
};