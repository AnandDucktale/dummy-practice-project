import express from 'express';
import verifyJWT from '../middleware/authenticationMiddleware.js';
import verifyRole from '../middleware/authorizationMiddelware.js';
import {
  addMemberToGroup,
  allGroups,
  allUsersInGroup,
  fetchGroupByInviteToken,
  generateInviteToken,
  groupData,
  groupMembers,
  leaveGroup,
  makeGroup,
  createGroup,
  removeMemberFromGroup,
  sendDocument,
  validateInviteToken,
  groups,
  groupDetail,
  deleteDocuments,
  deleteGroup,
} from '../controller/groupController.js';

const router = express.Router();

router.post('/makeGroup', verifyJWT, verifyRole, makeGroup);
router.post('/createGroup', verifyJWT, verifyRole, createGroup);
router.post('/addMemberToGroup', verifyJWT, verifyRole, addMemberToGroup);
router.post(
  '/removeMemberFromGroup',
  verifyJWT,
  verifyRole,
  removeMemberFromGroup,
);
router.get('/showAllGroupsToAdmin', verifyJWT, verifyRole, allGroups);
router.get('/allUsersInGroup', verifyJWT, verifyRole, allUsersInGroup);
router.post('/generateInviteToken', verifyJWT, verifyRole, generateInviteToken);

router.get('/groups', verifyJWT, groups);
router.post('/fetchGroupByInviteToken', verifyJWT, fetchGroupByInviteToken);
router.post('/sendDocument', verifyJWT, sendDocument);
router.get('/groupDetail', verifyJWT, groupDetail);
router.get('/groupData', verifyJWT, groupData);
router.get('/groupMembers', verifyJWT, groupMembers);
router.get('/validateInviteToken', validateInviteToken);

router.post('/leaveGroup', verifyJWT, leaveGroup);
router.post('/deleteDocuments', verifyJWT, deleteDocuments);
router.post('/deleteGroup', verifyJWT, verifyRole, deleteGroup);

export default router;
