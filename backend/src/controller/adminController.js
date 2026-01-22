import logger from '../logger.js';
import ApiError from '../utils/ApiError.js';

import {
  deleteUserSchema,
  getUserDetailSchema,
  searchUserSchema,
} from '../validations/admin.validation.js';
import {
  getAllUsersService,
  deleteUserService,
  getUserDetailService,
  searchUserService,
} from '../services/adminService.js';

export const getAllUsers = async (req, res) => {
  try {
    const response = await getAllUsersService(req.query);
    logger.info(response, 'All users for admin');

    return res.status(200).json({
      success: true,
      message: 'All users for admin',
      users: response.users,
      totalPages: response.totalPages,
    });
  } catch (error) {
    logger.error(error, 'Error while getting all users');

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

export const deleteUser = async (req, res) => {
  try {
    const { error } = deleteUserSchema.validate({
      deleteUserId: req.body.deleteUserId,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await deleteUserService(req.body.deleteUserId);
    logger.info(response, 'User deleted');

    return res.status(200).json({
      success: true,
      message: 'User deleted',
    });
  } catch (error) {
    logger.error(error, 'Error while deleting the user');

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

export const userDetail = async (req, res) => {
  try {
    const { error } = getUserDetailSchema.validate({
      userId: req.body.userId,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await getUserDetailService(req.body.userId);
    logger.info(response, 'Admin ask for single user detail');

    return res.status(200).json({
      success: true,
      message: 'Admin ask for single user detail',
      user: response.user,
    });
  } catch (error) {
    logger.error(error, 'Error while getting single user detail');

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

export const searchUser = async (req, res) => {
  try {
    const { error } = searchUserSchema.validate({
      page: req.query.page,
      limit: req.query.limit,
      field: req.query.field,
      search: req.query.search,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await searchUserService(req.query);
    logger.info(response, 'Admin search for users');

    return res.status(200).json({
      success: true,
      message: 'Admin search for users',
      page: response.page,
      limit: response.limit,
      total: response.total,
      totalPages: response.totalPages,
      users: response.users,
    });
  } catch (error) {
    logger.error(error, 'Error while search the contact');

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
