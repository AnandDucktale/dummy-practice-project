import Joi from 'joi';

import { email, objectId, pagination } from './common.validation.js';

export const contactsSchema = Joi.object({
  page: pagination.extract('page'),
  limit: pagination.extract('limit'),
  field: Joi.string(),
  contactOwnerId: objectId
    .required()
    .messages({ 'any.required': 'Owner Id is required' }),
});

export const searchContactsSchema = Joi.object({
  page: pagination.extract('page'),
  limit: pagination.extract('limit'),
  field: Joi.string(),
  search: Joi.string(),
  contactOwnerId: objectId
    .required()
    .messages({ 'any.required': 'Owner Id is required' }),
});

export const contactDetailSchema = Joi.object({
  contactId: objectId
    .required()
    .messages({ 'any.required': 'Contact Id is required' }),
});

export const editContactSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ 'any.required': 'Name is required' }),
  email: email.required().messages({ 'any.required': 'Email is required' }),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be exactly 10 digits',
      'any.required': 'Phone number is required',
    }),
  contactId: objectId.required().messages({
    'any.required': 'Contact Id is required',
  }),
});

export const addContactSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ 'any.required': 'Name is required' }),
  email: email.required().messages({ 'any.required': 'Email is required' }),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be exactly 10 digits',
      'any.required': 'Phone number is required',
    }),
  contactOwnerId: objectId.required().messages({
    'any.required': 'Contact Owner Id is required',
  }),
});
