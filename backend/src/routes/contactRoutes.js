import express from 'express';

import authentication from '../middleware/authenticationMiddleware.js';

import {
  contacts,
  searchContacts,
  contactDetail,
  editContact,
  addContact,
} from '../controller/contactController.js';

const router = express.Router();

router.get('/', authentication, contacts);
router.get('/search', authentication, searchContacts);
router.get('/getContact', authentication, contactDetail);
router.post('/editContact', authentication, editContact);
router.post('/addContact', authentication, addContact);

export default router;
