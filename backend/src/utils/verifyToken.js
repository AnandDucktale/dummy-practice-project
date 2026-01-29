import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import ApiError from './ApiError.js';

export const verifyToken = async (token) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Access Token expired');
    }
    if (err.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid Token');
    }
  }

  const user = await User.findById(decodedToken?._id).select(
    '-password -refreshToken',
  );
  // console.log(user);

  if (!user) {
    throw new ApiError(401, 'User is not authenticated');
  }

  return user;
};
