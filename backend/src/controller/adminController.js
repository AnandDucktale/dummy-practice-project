import {
  getAllUsersService,
  deleteUserService,
  getUserDetailService,
  searchUserService,
} from '../services/adminService.js';
import ApiError from '../utils/ApiError.js';
import {
  deleteUserSchema,
  getUserDetailSchema,
} from '../validations/admin.validation.js';

export const getAllUsers = async (req, res) => {
  try {
    const response = await getAllUsersService(req.query);

    return res.status(200).json({
      message: 'Users',
      users: response.users,
      totalPages: response.totalPages,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error while getting all users:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { error } = deleteUserSchema.validate({
      deleteUserId: req.body.deleteUserId,
    });

    // console.log('Delete user Id: ', req.body.deleteUserId);

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await deleteUserService(req.body.deleteUserId);
    // return res.status(200).json({
    //   message: 'User Deleted',
    // });

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

    console.error('Error while deleting the user:', error);
    return res.status(500).json({
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

    return res.status(response.status).json({
      message: response.message,
      user: response.user,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error while getting user detail:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const searchUser = async (req, res) => {
  try {
    console.log(req.query);

    // const { error } = searchUserSchema.validate({
    //   page: req.query.page,
    //   limit: req.query.limit,
    //   field: req.query.field,
    //   search: req.query.search,
    // });

    // if (error) {
    //   throw new ApiError(400, error.details[0].message);
    // }

    const response = await searchUserService(req.query);

    // console.log(response);

    return res.status(200).json({
      message: response.message,
      page: response.page,
      limit: response.limit,
      total: response.total,
      totalPages: response.totalPages,
      users: response.users,
    });
  } catch (error) {
    console.error('Error while search the contact:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error while search the contact:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
