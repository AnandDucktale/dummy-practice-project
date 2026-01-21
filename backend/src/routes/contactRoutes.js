import express from 'express';
import verifyJWT from '../middleware/authenticationMiddleware.js';
import {
  contacts,
  searchContacts,
  contactDetail,
  editContact,
  addContact,
} from '../controller/contactController.js';
const router = express.Router();

router.get('/', verifyJWT, contacts);
router.get('/search', verifyJWT, searchContacts);
router.get('/getContact', verifyJWT, contactDetail);
router.post('/editContact', verifyJWT, editContact);
router.post('/addContact', verifyJWT, addContact);

export default router;
