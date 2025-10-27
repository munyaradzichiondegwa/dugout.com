// validation.js

import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

export const validateRegistration = [
  body('phoneNumber')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('firstName')
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters long'),
  body('lastName')
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters long'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

export const validateLogin = [
  body('phoneNumber')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

export const validateVendor = [
  body('businessName')
    .isLength({ min: 2 })
    .withMessage('Business name must be at least 2 characters long'),
  body('vendorTypes')
    .isArray({ min: 1 })
    .withMessage('At least one vendor type is required'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be an array of [longitude, latitude]'),
  handleValidationErrors
];

export const validateMenuItem = [
  body('name')
    .isLength({ min: 2 })
    .withMessage('Item name must be at least 2 characters long'),
  body('price')
    .isInt({ min: 1 })
    .withMessage('Price must be a positive integer (in cents)'),
  body('itemType')
    .isIn(['food', 'beverage', 'grocery'])
    .withMessage('Item type must be food, beverage, or grocery'),
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
  handleValidationErrors
];