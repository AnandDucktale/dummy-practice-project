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

    return res.status(200).json({ message: response.message });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error while making group:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const createGroup = async (req, res) => {
  try {
    // console.log(req.body);
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

    return res
      .status(200)
      .json({ message: 'Group created', group: response.group });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error while creating group:', error);
    return res.status(500).json({
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

    return res.status(200).json({ message: response.message });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error while adding member to group:', error);
    return res.status(500).json({
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

    return res.status(200).json({
      message: 'User deleted',
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error while remove member from the group:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const allGroups = async (req, res) => {
  try {
    const response = await allGroupsService(req.user);

    return res.status(200).json({
      message: response.message,
      groups: response.groups,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error while getting all groups:', error);
    return res.status(500).json({
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

    return res.status(200).json({
      message: response.message,
      users: response.users,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error while fetching all users of group:', error);
    return res.status(500).json({
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

    return res.status(200).json({
      message: response.message,
      inviteLink: response.inviteLink,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error while generating invite token:', error);
    return res.status(500).json({
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
    // console.log(req.params);

    return res.status(200).json({
      success: true,
      message: 'All Groups',
      groups: response.groups,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('My Groups error:', error);
    return res.status(500).json({
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
    return res.status(200).json({
      success: true,
      message: 'Document sent',
      documents: response.documents,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Send document error:', error);
    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      message: 'Group Detail',
      groupDetail: response.groupDetail,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Group name error:', error);
    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      message: 'Group Detail',
      groupDetail: response.groupDetail,
      page: response.page,
      docsLimit: response.docsLimit,
      totalPages: response.totalPages,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Group detail error:', error);
    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'All Group members list',
      groupMembers: response.groupMembers,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Group member error:', error);
    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      message: 'Valid invite token.',
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Validate invite token error:', error);
    return res.status(500).json({
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

    // console.log(response);

    return res.status(200).json({
      success: true,
      message: 'Joined through invite link',
      groupName: response.groupName,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Fetch group by invite token error:', error);
    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      isAdmin: false,
      message: 'User Left the Group',
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Leave group error:', error);
    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      message: 'Documents deleted',
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Document deleted error:', error);
    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      message: 'Group deleted',
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Group deleted error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
