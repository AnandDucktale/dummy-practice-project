import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyJWT = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // || req.cookies?.accessToken;
  // console.log(token);

  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized request',
    });
  }
  // console.log('token then');
  // check decoded token is valid
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //   console.log(decodedToken);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Access Token expired',
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid Token',
      });
    }
  }

  // console.log(decodedToken);

  const user = await User.findById(decodedToken?._id).select(
    '-password -refreshToken'
  );
  // console.log(user);

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated',
    });
  }

  req.user = user;

  next();
};

export default verifyJWT;
