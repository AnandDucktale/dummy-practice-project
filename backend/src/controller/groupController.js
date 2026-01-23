import logger from '../logger.js';
import ApiError from '../utils/ApiError.js';

import {
  addMemberToGroupSchema,
  allUsersInGroupSchema,
  deleteDocumentsSchema,
  deleteGroupSchema,
  fetchGroupByInviteTokenSchema,
  generateInviteTokenSchema,
  groupDataSchema,
  groupDetailSchema,
  groupMembersSchema,
  groupsSchema,
  leaveGroupSchema,
  makeGroupSchema,
  removeMemberFromGroupSchema,
  sendDocumentSchema,
  validateInviteTokenSchema,
} from '../validations/group.validation.js';
import {
  makeGroupService,
  allGroupsService,
  allUsersInGroupService,
  addMemberToGroupService,
  generateInviteTokenService,
  removeMemberFromGroupService,
  sendDocumentService,
  groupDataService,
  groupDetailService,
  groupMembersService,
  validateInviteTokenService,
  fetchGroupByInviteTokenService,
  leaveGroupService,
  createGroupWithoutIconService,
  groupsService,
  createGroupWithIconService,
  deleteDocumentsService,
  deleteGroupService,
} from '../services/groupService.js';

export const makeGroup = async (req, res) => {
  try {
    const { error } = makeGroupSchema.validate({
      groupName: req.body.groupName,
      userIds: req.body.userIds,
    });
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await makeGroupService(
      req.body.groupName,
      req.body.userIds,
    );
    logger.info(response, 'Make group');

    return res.status(200).json({ success: true, message: 'Make group' });
  } catch (error) {
    logger.error(error, 'Error while making group');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const createGroup = async (req, res) => {
  try {
    let response;

    if (req?.files) {
      response = await createGroupWithIconService(
        req?.files.newGroupIcon,
        req.body,
        req.user,
      );
    } else {
      response = await createGroupWithoutIconService(req.body, req.user);
    }
    logger.info(response, 'Group created');

    return res
      .status(200)
      .json({ success: true, message: 'Group created', group: response.group });
  } catch (error) {
    logger.error(error, 'Error while creating group');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const addMemberToGroup = async (req, res) => {
  try {
    const { error } = addMemberToGroupSchema.validate({
      groupId: req.body.groupId,
      selectedUserIds: req.body.selectedUserIds,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await addMemberToGroupService(
      req.body.groupId,
      req.body.selectedUserIds,
    );
    logger.info(response, 'Members added to group');

    return res
      .status(200)
      .json({ success: true, message: 'Members added to group' });
  } catch (error) {
    logger.error(error, 'Error while adding member to group');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const removeMemberFromGroup = async (req, res) => {
  try {
    const { error } = removeMemberFromGroupSchema.validate({
      groupId: req.body.groupId,
      selectedUserIds: req.body.selectedUserIds,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    const response = await removeMemberFromGroupService(
      req.user,
      req.body.groupId,
      req.body.selectedUserIds,
    );
    logger.info(response, 'Member removed from group');

    return res.status(200).json({
      success: true,
      message: 'Member removed from group',
    });
  } catch (error) {
    logger.error(error, 'Error while remove member from the group');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const allGroups = async (req, res) => {
  try {
    const response = await allGroupsService(req.user);
    logger.info(response, 'All groups');

    return res.status(200).json({
      success: true,
      message: 'All groups',
      groups: response.groups,
    });
  } catch (error) {
    logger.error(error, 'Error while getting all groups');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const allUsersInGroup = async (req, res) => {
  try {
    const { error } = allUsersInGroupSchema.validate({
      groupId: req.query.groupId,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    const response = await allUsersInGroupService(req.query.groupId);
    logger.info(response, 'Users in group');

    return res.status(200).json({
      success: true,
      message: 'Users in group',
      users: response.users,
    });
  } catch (error) {
    logger.error(error, 'Error while fetching all users of group');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const generateInviteToken = async (req, res) => {
  try {
    const { error } = generateInviteTokenSchema.validate({
      groupId: req.body.groupId,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    const response = await generateInviteTokenService(req.body.groupId);
    logger.info(response, 'Invite token generated by admin');

    return res.status(200).json({
      success: true,
      message: 'Invite token generated by admin',
      inviteLink: response.inviteLink,
    });
  } catch (error) {
    logger.error(error, 'Error while generating invite token');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const groups = async (req, res) => {
  try {
    // console.log(req.params);
    // console.log(req.body);
    console.log(req.query);

    // const { error } = groupsSchema.validate({
    //   page: req.query.page,
    //   limit: req.query.limit,
    // });

    // if (error) {
    //   throw new ApiError(400, error.details[0].message);
    // }
    const response = await groupsService(req.user, req.query);
    logger.info(response, 'All groups of user');
    // console.log(req.params);

    return res.status(200).json({
      success: true,
      message: 'All groups of user',
      groups: response.groups,
    });
  } catch (error) {
    logger.error(error, 'My Groups error');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const sendDocument = async (req, res) => {
  try {
    const { error } = sendDocumentSchema.validate({
      userId: req.user?._id.toString(),
      groupId: req.body?.groupId,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    // console.log(Array.isArray(req.files.documents));
    // console.log(req.body);
    const response = await sendDocumentService(
      req.user?._id,
      req.body?.groupId,
      req.files?.documents,
    );
    logger.info(response, 'Document sent');

    return res.status(200).json({
      success: true,
      message: 'Document uploaded',
      documents: response.documents,
    });
  } catch (error) {
    logger.error(error, 'Send document error');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const groupDetail = async (req, res) => {
  try {
    const { error } = groupDetailSchema.validate({
      groupId: req.query.groupId,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    const response = await groupDetailService(req.query.groupId);
    logger.info(response, 'Group Detail');

    return res.status(200).json({
      success: true,
      message: 'Group Detail',
      groupDetail: response.groupDetail,
    });
  } catch (error) {
    logger.error(error, 'Group name error');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const groupData = async (req, res) => {
  try {
    const { error } = groupDataSchema.validate({
      groupId: req.query.groupId,
      docsLimit: req.query.docsLimit,
      page: req.query.page,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    const response = await groupDataService(req.query);
    logger.info(response, 'Group Data');

    return res.status(200).json({
      success: true,
      message: 'Group Data',
      groupDetail: response.groupDetail,
      page: response.page,
      docsLimit: response.docsLimit,
      totalPages: response.totalPages,
    });
  } catch (error) {
    logger.error(error, 'Error while fetching group data');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const groupMembers = async (req, res) => {
  try {
    const { error } = groupMembersSchema.validate({
      groupId: req.query.groupId,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    const response = await groupMembersService(req.query.groupId);
    logger.info(response, 'All Group member list');

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'All Group member list',
      groupMembers: response.groupMembers,
    });
  } catch (error) {
    logger.error(error, 'Error while fetching group members');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const validateInviteToken = async (req, res) => {
  try {
    const { error } = validateInviteTokenSchema.validate({
      token: req.query.token,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    const response = await validateInviteTokenService(req.query.token);
    logger.info(response, 'Valid invite token');

    return res.status(200).json({
      success: true,
      message: 'Valid invite token',
    });
  } catch (error) {
    logger.error(error, 'Validate invite token error');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const fetchGroupByInviteToken = async (req, res) => {
  try {
    const { error } = fetchGroupByInviteTokenSchema.validate({
      userId: req.user._id.toString(),
      token: req.body.token,
    });
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await fetchGroupByInviteTokenService(
      req.user._id,
      req.body.token,
    );
    logger.info(response, 'Joined through invite link');

    // console.log(response);

    return res.status(200).json({
      success: true,
      message: 'Joined through invite link',
      groupName: response.groupName,
    });
  } catch (error) {
    logger.error(error, 'Fetch group by invite token error');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { error } = leaveGroupSchema.validate({
      userId: req.body.userId,
      groupId: req.body.groupId,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    const response = await leaveGroupService(
      req.user,
      req.body.userId,
      req.body.groupId,
    );
    logger.info(response, 'User Left the Group');

    return res.status(200).json({
      success: true,
      isAdmin: false,
      message: 'User Left the Group',
    });
  } catch (error) {
    logger.error(error, 'Leave group error');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteDocuments = async (req, res) => {
  try {
    const { error } = deleteDocumentsSchema.validate({
      selectedDocsIds: req.body.selectedDocsIds,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    const response = await deleteDocumentsService(
      req.body.selectedDocsIds,
      req.user,
    );
    logger.info(response, 'Documents deleted');

    return res.status(200).json({
      success: true,
      message: 'Documents deleted',
    });
  } catch (error) {
    logger.error(error, 'Document deleted error');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { error } = deleteGroupSchema.validate({
      groupId: req.body.groupId,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    const response = await deleteGroupService(req.body);
    logger.info(response, 'Group deleted');

    return res.status(200).json({
      success: true,
      message: 'Group deleted',
    });
  } catch (error) {
    logger.error(error, 'Group deleted error');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
