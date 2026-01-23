import Joi from 'joi';

import {
  email,
  password,
  firstName,
  lastName,
  otp,
} from './common.validation.js';

export const signupSchema = Joi.object({
  firstName: firstName
    .required()
    .messages({ 'any.required': 'First name is required' }),
  lastName: lastName
    .required()
    .messages({ 'any.required': 'Last name is required' }),
  email: email.required().messages({ 'any.required': 'Email is required' }),
  password: password
    .required()
    .messages({ 'any.required': 'Password is required' }),
});

export const verifyEmailSchema = Joi.object({
  email: email.required().messages({ 'any.required': 'Email is required' }),
  userOtp: otp.required().messages({ 'any.required': 'OTP is required' }),
});

export const loginSchema = Joi.object({
  email: email.required().messages({ 'any.required': 'Email is required' }),
  password: password
    .required()
    .messages({ 'any.required': 'Password is required' }),
});

export const authGoogleSchema = Joi.object({
  googleToken: Joi.string()
    .required()
    .messages({ 'any.required': 'Google token is required' }),
});

export const resetPassSendOTPSchema = Joi.object({
  email: email.required().messages({ 'any.required': 'Email is required' }),
});

export const resetPassVerifyOTPSchema = Joi.object({
  email: email.required().messages({ 'any.required': 'Email is required' }),
  userOtp: otp.required().messages({ 'any.required': 'OTP is required' }),
});

export const resetPasswordSchema = Joi.object({
  userResetToken: Joi.string()
    .required()
    .messages({ 'any.required': 'Token is required' }),
  newPassword: password
    .required()
    .messages({ 'any.required': 'Password is required' }),
});
