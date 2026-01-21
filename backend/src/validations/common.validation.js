import Joi from 'joi';

export const email = Joi.string().email().lowercase().trim().messages({
  'any.required': 'Email is required',
});

export const password = Joi.string().min(8).max(30).messages({
  'string.pattern.base':
    'Password must contain at least one letter and one number',
  'string.min': 'Too short password',
  'string.max': 'Too long password',
  'any.required': 'Password is required',
});

export const firstName = Joi.string()
  .min(3)
  .max(30)
  .trim()
  .pattern(/^[A-Za-z]+$/)
  .messages({
    'string.pattern.base': 'First name must contain only letters',
  });

export const lastName = Joi.string()
  .min(3)
  .max(30)
  .trim()
  .pattern(/^[A-Za-z]+$/)
  .messages({
    'string.pattern.base': 'Last name must contain only letters',
  });

export const objectId = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .messages({
    'string.pattern.base': 'Invalid MongoDB ObjectId',
  });

export const otp = Joi.string().length(6).pattern(/^\d+$/).messages({
  'string.length': 'OTP must be exactly 6 digits',
  'string.pattern.base': 'OTP must contain only digits',
});

export const pagination = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.min': 'Page must be at least 1',
  }),

  limit: Joi.number().integer().min(1).max(50).default(10).messages({
    'number.base': 'Limit must be a number',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 50',
  }),
});
