import jwt from 'jsonwebtoken';
import path from 'path';
import fs, { mkdir } from 'fs';

import ApiError from '../utils/ApiError.js';

import Group from '../models/Group.js';
import User from '../models/User.js';
import UserGroup from '../models/UserGroup.js';
import Document from '../models/Document.js';
import logger from '../logger.js';

export const makeGroupService = async (groupName, userIds) => {
  const users = await User.find({
    _id: {
      $in: userIds,
    },
  }).select('_id');

  if (users.length !== userIds.length) {
    throw new ApiError(404, 'Some users are not found');
  }

  const group = await Group.create({
    name: groupName,
  });

  const relations = await UserGroup.insertMany(
    userIds.map((id) => ({ userId: id, groupId: group._id })),
  );
  return;
};

export const createGroupWithoutIconService = async (
  { newGroupName, newGroupDescription },
  admin,
) => {
  if (!newGroupName) {
    throw new ApiError(400, 'Group name is required');
  }

  const group = await Group.create({
    name: newGroupName,
    description: newGroupDescription || '',
    icon: '',
  });

  const createRelation = await UserGroup.create({
    userId: admin._id,
    groupId: group._id,
  });

  return {
    group,
  };
};

export const createGroupWithIconService = async (
  newGroupIcon,
  { newGroupName, newGroupDescription },
  admin,
) => {
  if (!newGroupName) {
    throw new ApiError(400, 'Group name is required');
  }

  if (!newGroupIcon) {
    throw new ApiError(400, 'Failed to upload group icon');
  }

  if (newGroupIcon.size > 1048576 * 2) {
    throw new ApiError(400, 'Icon size must be less than 2MB');
  }
  const uploadDir = path.join(process.cwd(), 'uploads');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileExt = path.extname(newGroupIcon.name);
  const fileName = `group-icon-${Date.now()}${fileExt}`;

  const uploadPath = path.join(uploadDir, fileName);

  await newGroupIcon.mv(uploadPath);

  const fileUrl = `http://localhost:9999/uploads/${fileName}`;

  const group = await Group.create({
    name: newGroupName,
    description: newGroupDescription || '',
    icon: fileUrl,
  });

  const createRelation = await UserGroup.create({
    userId: admin._id,
    groupId: group._id,
  });

  return {
    group,
  };
};

export const addMemberToGroupService = async (groupId, selectedUserIds) => {
  const users = await User.find({
    _id: {
      $in: selectedUserIds,
    },
  }).select('_id');
  if (users.length !== selectedUserIds.length) {
    return {
      success: false,
      status: 400,
      message: 'Some users are not found',
    };
  }

  const relations = await UserGroup.insertMany(
    selectedUserIds.map((id) => ({ userId: id, groupId: groupId })),
  );

  return {
    success: true,
    status: 200,
    message: 'Members Added',
  };
};

export const removeMemberFromGroupService = async (
  admin,
  groupId,
  selectedUserIds,
) => {
  const users = await User.find({
    _id: {
      $in: selectedUserIds,
    },
  }).select('_id');
  if (users.length !== selectedUserIds.length) {
    throw new ApiError(400, 'Some users are not found');
  }

  if (selectedUserIds.includes(admin._id.toString())) {
    selectedUserIds = selectedUserIds.filter(
      (id) => id !== admin._id.toString(),
    );
    throw new ApiError(400, "Can't remove admin");
  }

  const deletedUsersAck = await UserGroup.deleteMany({
    groupId: groupId,
    userId: { $in: selectedUserIds },
  });

  const deletedDocsAck = await Document.deleteMany({
    groupId: groupId,
    senderId: { $in: selectedUserIds },
  });

  return;
};

export const allGroupsService = async () => {
  const groups = (await Group.find({})).sort({ createdAt: -1 });
  if (!groups || groups.length === 0) {
    throw new ApiError(404, 'No group available');
  }

  return {
    groups: groups,
  };
};

export const allUsersInGroupService = async ({ groupId }) => {
  const usersIdPresentInGroup = await UserGroup.find({
    groupId: groupId,
  }).select('userId');

  if (usersIdPresentInGroup.length === 0) {
    return {
      success: false,
      status: 200,
      message: 'No user available in this group',
    };
  }

  const userIds = usersIdPresentInGroup.map((id) => id.userId);

  const users = await User.find({
    _id: {
      $in: userIds,
    },
  }).select('_id firstName lastName avatar');

  return {
    users,
  };
};

export const generateInviteTokenService = async (groupId) => {
  const group = await Group.findById(groupId);
  if (!group) {
    throw new ApiError(404, 'Group not found');
  }

  const token = jwt.sign(
    {
      groupId,
    },
    process.env.INVITE_JWT_SECRET,
    {
      expiresIn: process.env.INVITE_JWT_EXPIRY,
    },
  );

  const inviteLink = `${process.env.FRONTEND_URL}/invite/${token}`;

  return {
    inviteLink,
  };
};

export const groupsService = async (user, { page, limit }) => {
  const skip = (page - 1) * limit;

  const groups = await UserGroup.find({ userId: user._id })
    .populate({
      path: 'groupId',
      select: 'name description icon',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    groups: groups,
  };
};

export const sendDocumentService = async (userId, groupId, documents) => {
  if (!userId) {
    throw new ApiError(401, 'User not authenticated.');
  }

  if (!groupId || !documents) {
    throw new ApiError(400, 'Both files and Group Id are required.');
  }

  const user = await UserGroup.findOne({ userId: userId, groupId: groupId });
  if (!user) {
    throw new ApiError(404, 'Only member can send documents.');
  }

  const files = Array.isArray(documents) ? documents : [documents];

  if (files.length === 0) {
    throw new ApiError(400, 'No files uploaded.');
  }

  const filteredFiles = files.filter((file) => file.size <= 1048576 * 2);

  if (filteredFiles.length !== files.length) {
    throw new ApiError(400, 'Files size not more than 2MB');
  }

  const uploadDir = path.join(process.cwd(), 'uploads');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const savedDocuments = [];

  for (const file of filteredFiles) {
    const fileExt = path.extname(file.name);
    const fileName = `document-${Date.now()}-${Math.random()
      .toString()
      .slice(2)}${fileExt}`;

    const uploadPath = path.join(uploadDir, fileName);
    await file.mv(uploadPath);

    const fileUrl = `http://localhost:9999/uploads/${fileName}`;

    const document = await Document.create({
      senderId: userId,
      groupId: groupId,
      documentUrl: fileUrl,
      fileName: file.name,
      fileExt: fileExt,
    });

    savedDocuments.push(document);
  }

  return {
    documents: savedDocuments,
  };
};

export const groupDetailService = async (groupId) => {
  const groupDetail = await Group.findById({ _id: groupId }).select(
    'name icon',
  );

  return {
    groupDetail: groupDetail,
  };
};

export const groupDataService = async ({ groupId, docsLimit, page }) => {
  const groupDetail = await Document.find({ groupId: groupId })
    .populate('senderId', '_id firstName')
    .populate('groupId', 'name')
    .select('documentUrl fileName fileExt')
    .skip((page - 1) * docsLimit)
    .limit(docsLimit);

  if (!groupDetail || groupDetail.length === 0) {
    return {
      success: true,
      status: 200,
      message: 'No Group Detail',
      groupDetail: [],
    };
  }
  const totalDocs = await Document.countDocuments({ groupId: groupId });
  const totalPages = Math.ceil(totalDocs / docsLimit);

  return {
    groupDetail: groupDetail,
    page: page,
    docsLimit: docsLimit,
    totalPages: totalPages,
  };
};

export const groupMembersService = async (groupId) => {
  const groupMembers = await UserGroup.find({ groupId: groupId }).populate(
    'userId',
    '_id firstName lastName avatar',
  );

  return {
    groupMembers,
  };
};

export const validateInviteTokenService = async (token) => {
  let payload;
  try {
    payload = jwt.verify(token, process.env.INVITE_JWT_SECRET);

    const groupId = payload.groupId;
    return {
      groupId,
    };
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Access token expired.');
    }
    if (err.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid Token.');
    }
  }
};

export const fetchGroupByInviteTokenService = async (userId, token) => {
  const payload = jwt.verify(token, process.env.INVITE_JWT_SECRET);
  const groupId = payload.groupId;

  const group = await Group.findById(groupId);
  if (!group) {
    throw new ApiError(404, 'Group not found.');
  }

  const alreadyUser = await UserGroup.findOne({
    userId: userId,
    groupId: groupId,
  });

  if (alreadyUser) {
    throw new ApiError(409, 'User already present in group.');
  }

  const addUser = await UserGroup.create({
    groupId: groupId,
    userId: userId,
  });

  return {
    groupName: group.name,
  };
};

export const leaveGroupService = async (user, userId, groupId) => {
  if (!userId) {
    throw new ApiError(400, 'UserId is required.');
  }
  if (user.role === 'admin') {
    throw new ApiError(400, "Admin can't leave the group.");
  }

  const leftUserAck = await UserGroup.deleteOne({
    userId: userId,
    groupId: groupId,
  });

  if (leftUserAck.deletedCount === 0) {
    throw new ApiError(404, 'User does not found.');
  }

  const deleteDocsAck = await Document.deleteMany({
    groupId: groupId,
    senderId: userId,
  });

  return {
    isAdmin: false,
  };
};

export const deleteDocumentsService = async (selectedDocsIds, user) => {
  let deletedDocsAck;
  if (user.role === 'admin') {
    deletedDocsAck = await Document.deleteMany({
      _id: { $in: selectedDocsIds },
    });
  } else {
    deletedDocsAck = await Document.deleteMany({
      senderId: user._id,
      _id: { $in: selectedDocsIds },
    });
  }

  return;
};

export const deleteGroupService = async ({ groupId }) => {
  const deleteUserFromGroupAck = await UserGroup.deleteMany({
    groupId: groupId,
  });
  const docsDeleteAck = await Document.deleteMany({
    groupId: groupId,
  });
  const groupDeleteAck = await Group.deleteOne({ _id: groupId });

  return;
};
