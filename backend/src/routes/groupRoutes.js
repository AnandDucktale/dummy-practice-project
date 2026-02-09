import express from 'express';

import authentication from '../middleware/authenticationMiddleware.js';
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
  newGroupMessage,
  groupMessages,
} from '../controller/groupController.js';

const router = express.Router();

router.post('/makeGroup', authentication, verifyRole, makeGroup);
router.post('/createGroup', authentication, verifyRole, createGroup);
router.post('/addMemberToGroup', authentication, verifyRole, addMemberToGroup);
router.post(
  '/removeMemberFromGroup',
  authentication,
  verifyRole,
  removeMemberFromGroup,
);
router.get('/showAllGroupsToAdmin', authentication, verifyRole, allGroups);
router.get('/allUsersInGroup', authentication, verifyRole, allUsersInGroup);
router.post(
  '/generateInviteToken',
  authentication,
  verifyRole,
  generateInviteToken,
);
router.get('/groups', authentication, groups);
router.post(
  '/fetchGroupByInviteToken',
  authentication,
  fetchGroupByInviteToken,
);
router.post('/sendDocument', authentication, sendDocument);
router.post('/newGroupMessage', authentication, newGroupMessage);
router.get('/groupDetail', authentication, groupDetail);
router.get('/groupMessages', authentication, groupMessages);
router.get('/groupData', authentication, groupData);
router.get('/groupMembers', authentication, groupMembers);
router.get('/validateInviteToken', validateInviteToken);
router.post('/leaveGroup', authentication, leaveGroup);
router.post('/deleteDocuments', authentication, deleteDocuments);
router.post('/deleteGroup', authentication, verifyRole, deleteGroup);

export default router;
