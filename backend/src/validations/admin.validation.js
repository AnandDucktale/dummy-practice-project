import Joi from 'joi';

import { objectId, pagination } from './common.validation.js';

export const deleteUserSchema = Joi.object({
  deleteUserId: objectId.required().messages({
    'any.required': 'User Id is required',
  }),
});

export const getUserDetailSchema = Joi.object({
  userId: objectId.required().messages({
    'any.required': 'User Id is required',
  }),
});

export const searchUserSchema = Joi.object({
  page: pagination.extract('page'),
  limit: pagination.extract('limit'),
  field: Joi.string(),
  search: Joi.string(),
  // contactOwnerId: objectId
  //   .required()
  //   .messages({ 'any.required': 'Owner Id is required' }),
});
