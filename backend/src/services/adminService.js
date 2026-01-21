import Contact from '../models/Contact.js';
import Document from '../models/Document.js';
import User from '../models/User.js';
import UserGroup from '../models/UserGroup.js';
import { firstName } from '../validations/common.validation.js';

export const getAllUsersService = async ({ page, contactLimit, field }) => {
  console.log(page, contactLimit, field);
  const skipContacts = (page - 1) * contactLimit;

  let users;
  if (field === 'email') {
    users = await User.find()
      .select('_id email firstName lastName avatar role')
      .sort({ email: 1 })
      .skip(skipContacts)
      .limit(contactLimit);
  } else if (field === 'name') {
    users = await User.find()
      .select('_id email firstName lastName avatar role')
      .sort({ firstName: 1 })
      .skip(skipContacts)
      .limit(contactLimit);
  } else {
    users = await User.find()
      .select('_id email firstName lastName avatar role')
      .skip(skipContacts)
      .limit(contactLimit);
  }

  const totalUsers = await User.countDocuments();
  const totalPages = Math.ceil(totalUsers / contactLimit);

  // console.log(users);

  return {
    success: true,
    status: 200,
    message: 'All users',
    users,
    totalPages: totalPages,
  };
};

export const deleteUserService = async (deleteUserId) => {
  //   console.log(user);
  //   console.log(deleteUserId);

  // Remove user from app
  // 1 delete its contact
  const deletedUserContacts = await Contact.deleteMany({
    contactOwnerId: deleteUserId,
  });
  // 2 delete its documents
  const deletedUserDocs = await Document.deleteMany({
    senderId: deleteUserId,
  });
  // 3 delete from groups
  const removeUserFromGroups = await UserGroup.deleteMany({
    userId: deleteUserId,
  });
  // 4 delete user
  const deletedUserAck = await User.deleteOne({ _id: deleteUserId });
  // console.log(response);

  return;
};

export const getUserDetailService = async (userId) => {
  //   console.log(user);
  //   console.log(deleteUserId);

  const user = await User.findOne({ _id: userId }).select(
    '_id firstName lastName email isVerified avatar role'
  );
  //   console.log(user);

  return {
    success: true,
    status: 200,
    message: 'User details.',
    user,
  };
};

export const searchUserService = async ({ page, limit, field, search }) => {
  const skip = (page - 1) * limit;
  // console.log(page, limit, search, field, contactOwnerId, skip);

  if (!search.trim() === '') {
    throw new ApiError(400, 'Nothing to search');
  }

  const query = {
    $or: [
      { firstName: { $regex: `^${search}`, $options: 'i' } },
      { email: { $regex: `^${search}`, $options: 'i' } },
    ],
  };

  let users;

  if (field === 'email') {
    users = await User.find({ email: { $regex: `^${search}`, $options: 'i' } })
      .sort({ email: 1 })
      .skip(skip)
      .limit(limit);
  } else if (field === 'name') {
    users = await User.find({
      firstName: { $regex: `^${search}`, $options: 'i' },
    })
      .sort({ firstName: 1 })
      .skip(skip)
      .limit(limit);
  } else {
    users = await User.find(query).skip(skip).limit(limit);
  }

  // console.log(contacts);

  const total = await User.countDocuments(query);

  // if (total === 0) {
  //   return {
  //     success: true,
  //     status: 200,
  //     contacts,
  //     totalContacts: 0,
  //     totalPages: 0,
  //   };
  // }
  return {
    success: true,
    status: 200,
    users,
    totalPages: Math.ceil(total / limit),
    total: total,
  };
};
