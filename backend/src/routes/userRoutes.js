import express from 'express';
const router = express.Router();
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

import verifyJWT from '../middleware/authenticationMiddleware.js';

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
