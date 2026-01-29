import express from 'express';

import authentication from '../middleware/authenticationMiddleware.js';
import verifyRole from '../middleware/authorizationMiddelware.js';

import {
  getAllUsers,
  deleteUser,
  userDetail,
  searchUser,
} from '../controller/adminController.js';

const router = express.Router();

router.get('/getAllUsers', authentication, verifyRole, getAllUsers);
router.post('/deleteUser', authentication, verifyRole, deleteUser);
router.post('/userDetail', authentication, verifyRole, userDetail);
router.get('/search', authentication, verifyRole, searchUser);

export default router;
