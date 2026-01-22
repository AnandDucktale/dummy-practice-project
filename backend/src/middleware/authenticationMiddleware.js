import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyJWT = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized request',
    });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access Token expired',
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid Token',
      });
    }
  }

  const user = await User.findById(decodedToken?._id).select(
    '-password -refreshToken',
  );
  // console.log(user);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User is not authenticated',
    });
  }

  req.user = user;

  next();
};

export default verifyJWT;
