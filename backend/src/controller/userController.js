import logger from '../logger.js';
import ApiError from '../utils/ApiError.js';

import {
  authGoogleService,
  loginService,
  signupService,
  verifyEmailService,
  resetPassSendOTPService,
  resetPassVerifyOTPService,
  resetPasswordService,
  logoutService,
  refreshAccessTokenService,
  avatarService,
} from '../services/userServices.js';
import {
  authGoogleSchema,
  loginSchema,
  resetPassSendOTPSchema,
  resetPassVerifyOTPSchema,
  resetPasswordSchema,
  signupSchema,
  verifyEmailSchema,
} from '../validations/user.validation.js';

export const home = (req, res) => {
  const user = req.user;
  // console.log(user._id);

  return res.status(200).json({
    message: 'User is verified',
  });
};

// Signin
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const { error } = signupSchema.validate({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const user = await signupService(firstName, lastName, email, password);
    logger.info(user, 'Verify the email in next step');

    return res.status(201).json({
      success: true,
      user,
      message: 'Verify the email in next step',
    });
  } catch (error) {
    logger.error(error, 'Signup error');

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

export const verifyUserEmail = async (req, res) => {
  try {
    const { error } = verifyEmailSchema.validate({
      email: req.body.email,
      userOtp: req.body.userOtp,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await verifyEmailService(req.body.email, req.body.userOtp);
    logger.info(response, 'Email Verified Successfully');

    return res.status(200).json({
      success: true,
      message: 'Email Verified Successfully',
      user: response.cleanUser,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
  } catch (error) {
    logger.error(error, 'Verify email error');

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

//login
export const login = async (req, res) => {
  // get all fields
  // check if fields are empty or not
  // then check user exist or not
  // check password is correct or not
  // remove password from response
  // send response

  try {
    // console.log('login');

    const { error } = loginSchema.validate({
      email: req.body.email,
      password: req.body.password,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await loginService(req.body.email, req.body.password);
    logger.info(response, 'Successfully logged in');

    return res.status(200).json({
      success: true,
      message: 'Successfully logged in',
      user: response.loggedUser,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
  } catch (error) {
    logger.error(error, 'Login error');

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

//login
export const authGoogle = async (req, res) => {
  try {
    const { error } = authGoogleSchema.validate({
      googleToken: req.body.googleToken,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await authGoogleService(req.body.googleToken);
    logger.info(response, 'User auth successful via google');

    return res.status(200).json({
      success: true,
      message: 'User auth successful via google',
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
  } catch (error) {
    logger.error(error, 'AuthGoogle error');

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

export const logout = async (req, res) => {
  try {
    // console.log(req.user?._id);
    const response = await logoutService(req.user?._id);
    logger.info(response, 'Logged out successfully');

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      refreshToken: response.refreshToken,
    });
  } catch (error) {
    logger.error(error, 'Logout error');

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

export const resetPassSendOTP = async (req, res) => {
  try {
    const { error } = resetPassSendOTPSchema.validate({
      email: req.body.email,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await resetPassSendOTPService(req.body.email);
    logger.info(response, 'OTP is sent to your email for reset the password');

    return res.status(200).json({
      success: true,
      message: 'OTP is sent to your email for reset the password',
    });
  } catch (error) {
    logger.error(error, 'Reset password send otp error');

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

export const resetPassVerifyOTP = async (req, res) => {
  try {
    const { error } = resetPassVerifyOTPSchema.validate({
      email: req.body.email,
      userOtp: req.body.userOtp,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await resetPassVerifyOTPService(
      req.body.email,
      req.body.userOtp,
    );
    logger.info(response, 'Reset token verify otp');

    return res.status(200).json({
      success: true,
      message: 'Reset token verify otp',
      resetToken: response.resetToken,
    });
  } catch (error) {
    logger.error(error, 'Reset password otp verify error');

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

export const resetPassword = async (req, res) => {
  try {
    const { error } = resetPasswordSchema.validate({
      userResetToken: req.body.userResetToken,
      newPassword: req.body.newPassword,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await resetPasswordService(
      req.body.userResetToken,
      req.body.newPassword,
    );
    logger.info(response, 'Password successfully changed');

    return res.status(200).json({
      success: true,
      message: 'Password successfully changed',
    });
  } catch (error) {
    logger.error(error, 'Reset password error');

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

export const refreshAccessToken = async (req, res) => {
  try {
    // console.log(req.body);

    const response = await refreshAccessTokenService(req.body.refreshToken);
    logger.info(response, 'Access token refreshed');

    return res.status(200).json({
      success: true,
      accessToken: response.accessToken,
      user: response.user,
      message: 'Access token refreshed',
    });
  } catch (error) {
    logger.error(error, 'Refresh access token error');

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

export const avatar = async (req, res) => {
  try {
    const response = await avatarService(req.files?.avatar, req.user?._id);
    logger.info(response, 'File uploaded');

    return res.status(200).json({
      success: true,
      avatar: response.avatarUrl,
      message: 'Avatar uploaded',
    });
  } catch (error) {
    logger.error(error, 'Upload avatar error');

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
