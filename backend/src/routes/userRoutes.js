import express from 'express';

import verifyJWT from '../middleware/authenticationMiddleware.js';

import {
  signup,
  login,
  authGoogle,
  verifyUserEmail,
  home,
  resetPassSendOTP,
  resetPassVerifyOTP,
  resetPassword,
  logout,
  refreshAccessToken,
  avatar,
} from '../controller/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verifyEmail', verifyUserEmail);
router.post('/login', login);
router.post('/auth/google', authGoogle);
router.post('/logout', verifyJWT, logout);
router.get('/home', verifyJWT, home);
router.post('/avatar', verifyJWT, avatar);
router.post('/refreshToken', refreshAccessToken);
router.post('/resetPassSendOtp', resetPassSendOTP);
router.post('/resetPassVerifyOtp', resetPassVerifyOTP);
router.post('/resetPassword', resetPassword);

export default router;
