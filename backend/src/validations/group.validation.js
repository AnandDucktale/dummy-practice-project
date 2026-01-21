import Joi from 'joi';
import { objectId, pagination } from './common.validation.js';

export const makeGroupSchema = Joi.object({
  groupName: Joi.string().required().messages({
    'any.required': 'Group name is required',
  }),
  userIds: Joi.array().items(objectId).required().messages({
    'array.base': 'Members must be an array',
    'any.required': 'At least one member is required',
  }),
});

export const addMemberToGroupSchema = Joi.object({
  groupId: objectId.required().messages({
    'any.required': 'User Id is required',
  }),
  selectedUserIds: Joi.array().items(objectId).min(1).required().messages({
    'array.base': 'Members must be an array',
    'array.min': 'Select at least one member',
    'any.required': 'Users are required to add in group',
  }),
});

export const removeMemberFromGroupSchema = Joi.object({
  groupId: objectId.required().messages({
    'any.required': 'User Id is required',
  }),
  selectedUserIds: Joi.array().items(objectId).min(1).required().messages({
    'array.base': 'Members must be an array',
    'array.min': 'Select at least one member',
    'any.required': 'Users are required to add in group',
  }),
});

export const allUsersInGroupSchema = Joi.object({
  groupId: objectId.required().messages({
    'any.required': 'User Id is required',
  }),
});

export const generateInviteTokenSchema = Joi.object({
  groupId: objectId.required().messages({
    'any.required': 'User Id is required',
  }),
});

export const myGroupsSchema = Joi.object({
  userId: objectId
    .required()
    .messages({ 'any.required': 'User Id is required' }),
});

export const groupsSchema = Joi.object({
  page: pagination.extract('page'),
  limit: pagination.extract('limit'),
});

export const sendDocumentSchema = Joi.object({
  userId: objectId
    .required()
    .messages({ 'any.required': 'User Id is required' }),
  groupId: objectId
    .required()
    .messages({ 'any.required': 'Group Id is required' }),
});

export const groupDetailSchema = Joi.object({
  groupId: objectId
    .required()
    .messages({ 'any.required': 'Group Id is required' }),
});

export const groupDataSchema = Joi.object({
  groupId: objectId
    .required()
    .messages({ 'any.required': 'Group Id is required' }),
  docsLimit: pagination.extract('limit'),
  page: pagination.extract('page'),
});

export const groupMembersSchema = Joi.object({
  groupId: objectId
    .required()
    .messages({ 'any.required': 'Group Id is required' }),
});

export const validateInviteTokenSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({ 'any.required': 'Token is required' }),
});

export const fetchGroupByInviteTokenSchema = Joi.object({
  userId: objectId.required().messages({
    'any.required': 'User Id is required.',
  }),
  token: Joi.string()
    .required()
    .messages({ 'any.required': 'Token is required' }),
});

export const leaveGroupSchema = Joi.object({
  userId: objectId.required().messages({
    'any.required': 'User Id is required.',
  }),
  groupId: objectId
    .required()
    .messages({ 'any.required': 'Group Id is required' }),
});

export const deleteDocumentsSchema = Joi.object({
  selectedDocsIds: Joi.array().items(objectId).min(1).required().messages({
    'array.base': 'Documents must be an array',
    'array.min': 'Select at least one member',
    'any.required': 'Documents are required to remove from group',
  }),
});

export const deleteGroupSchema = Joi.object({
  groupId: objectId
    .required()
    .messages({ 'any.required': 'Group Id is required' }),
});
