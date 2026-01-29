import jwt from 'jsonwebtoken';

import ApiError from '../utils/ApiError.js';
import { verifyToken } from '../utils/verifyToken.js';

const authentication = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized request',
    });
  }
  try {
    const user = await verifyToken(token);

    req.user = user;

    next();
  } catch (error) {
    logger.error(error, 'Logout error');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export default authentication;
