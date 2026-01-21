import express from 'express';
import {
  getAllUsers,
  deleteUser,
  userDetail,
  searchUser,
} from '../controller/adminController.js';
import verifyJWT from '../middleware/authenticationMiddleware.js';
import verifyRole from '../middleware/authorizationMiddelware.js';
const router = express.Router();

router.get('/getAllUsers', verifyJWT, verifyRole, getAllUsers);
router.post('/deleteUser', verifyJWT, verifyRole, deleteUser);
router.post('/userDetail', verifyJWT, verifyRole, userDetail);
router.get('/search', verifyJWT, verifyRole, searchUser);

export default router;
