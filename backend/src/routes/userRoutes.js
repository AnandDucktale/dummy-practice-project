import express from 'express';

import authentication from '../middleware/authenticationMiddleware.js';

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
router.post('/logout', authentication, logout);
router.get('/home', authentication, home);
router.post('/avatar', authentication, avatar);
router.post('/refreshToken', refreshAccessToken);
router.post('/resetPassSendOtp', resetPassSendOTP);
router.post('/resetPassVerifyOtp', resetPassVerifyOTP);
router.post('/resetPassword', resetPassword);

export default router;
