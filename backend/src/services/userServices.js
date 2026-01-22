import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

import { generateOTP } from '../utils/otpManager.js';
import { sendOTPEmail } from '../utils/mailer.js';
import client from '../utils/googleClient.js';
import ApiError from '../utils/ApiError.js';

import User from '../models/User.js';

export const signupService = async (firstName, lastName, email, password) => {
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, 'User already exist.');
  }

  // Otp generate
  const otp = generateOTP();
  console.log(`Account signup: ${otp}`);
  const otpCreatedAt = new Date();

  //Send OTP to email
  await sendOTPEmail(email, otp);
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    otp,
    otpCreatedAt,
    role: 'user',
  });

  const cleanUser = await User.findById(user._id).select('email');

  return cleanUser;
};

export const verifyEmailService = async (email, userOtp) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User does not exist.');
  }

  if (!user.otp) {
    throw new ApiError(400, 'No OTP found.');
  }

  // Check OTP matches or not

  if (user.otp !== userOtp) {
    throw new ApiError(400, 'Wrong OTP.');
  }

  // Check if otp expire or not
  const currentTime = new Date();
  const otpCreationTime = new Date(user.otpCreatedAt);
  const timeDifference = currentTime - otpCreationTime;
  const minutesDifference = timeDifference / 1000 / 60;
  // console.log('Time difference: ', minutesDifference);

  if (minutesDifference > 10) {
    user.otp = null;
    user.otpCreatedAt = null;
    await user.save();
    throw new ApiError(400, 'OTP expired.');
  }

  user.otp = null;
  user.otpCreatedAt = null;

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.isVerified = true;
  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  // Clean fields
  const cleanUser = await User.findById(user._id).select(
    '_id email firstName lastName avatar isVerified role',
  );

  return {
    cleanUser,
    accessToken,
    refreshToken,
  };
};

export const loginService = async (email, password) => {
  // Check user exist of that email or not
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, 'User does not exist.');
  }

  // Check the password correct or not
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, 'Password is incorrect.');
  }

  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  const loggedUser = await User.findById(user._id).select(
    '_id email firstName lastName avatar isVerified role',
  );

  return {
    loggedUser,
    accessToken,
    refreshToken,
  };
};

export const authGoogleService = async (googleToken) => {
  // verify the token
  const verifyToken = await client.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  // get payload
  const payload = verifyToken.getPayload();

  const {
    sub: googleId,
    email,
    given_name,
    family_name,
    picture,
    email_verified,
  } = payload;

  // Check if email verified or not
  if (!email_verified) {
    throw new ApiError(401, 'Google account email not verified.');
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      googleId,
      email,
      firstName: given_name,
      lastName: family_name,
      isVerified: email_verified,
      avatar: picture,
    });
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  return {
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      isVerified: user.isVerified,
      role: user.role,
    },
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

export const logoutService = async (userId) => {
  if (!userId) {
    throw new ApiError(401, 'User is not authenticated.');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: { refreshToken: null },
    },
    { new: true },
  ).select('refreshToken');

  return {
    refreshToken: user.refreshToken,
  };
};

export const resetPassSendOTPService = async (email) => {
  // User exist or not

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, 'Email does not exist.');
  }

  // Generate otp

  const otp = generateOTP();
  console.log(`Reset pass: ${otp}`);
  const otpCreatedAt = new Date();

  // send otp
  await sendOTPEmail(email, otp);

  // Generate reset token

  const resetToken = jwt.sign(
    {
      email,
    },
    process.env.RESET_PASS_TOKEN_SECRET,
    {
      expiresIn: process.env.RESET_PASS_TOKEN_EXPIRY,
    },
  );

  user.otp = otp;
  user.otpCreatedAt = otpCreatedAt;
  user.resetPassToken = resetToken;
  await user.save();

  return;
};

export const resetPassVerifyOTPService = async (email, userOtp) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User does not exist.');
  }
  // Check otp present in DB or not

  if (!user.otp) {
    throw new ApiError(400, 'No OTP found.');
  }

  // Check otp matches or not

  if (user.otp !== userOtp) {
    throw new ApiError(400, 'Wrong OTP.');
  }

  // Check otp expiry

  const currentTime = new Date();
  const otpCreationTime = new Date(user.otpCreatedAt);
  const timeDifference = currentTime - otpCreationTime;
  const minutesDifference = timeDifference / 1000 / 60;
  console.log('Time difference: ', minutesDifference);

  if (minutesDifference > 10) {
    user.otp = null;
    user.otpCreatedAt = null;
    await user.save();
    throw new ApiError(400, 'OTP expired.');
  }

  user.otp = null;
  user.otpCreatedAt = null;
  await user.save();

  return {
    resetToken: user.resetPassToken,
  };
};

export const resetPasswordService = async (userResetToken, newPassword) => {
  if (!userResetToken || !newPassword) {
    throw new ApiError(400, 'Both reset token and password are required.');
  }

  // Validate Token

  let decodedToken;
  try {
    decodedToken = jwt.verify(
      userResetToken,
      process.env.RESET_PASS_TOKEN_SECRET,
    );
    //   console.log(decodedToken);
  } catch (err) {
    console.log(err);
  }
  const email = decodedToken?.email;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User does not exist.');
  }

  if (userResetToken !== user.resetPassToken) {
    throw new ApiError(400, 'This password reset link is not valid.');
  }
  // const user = await User.findOne({ email });

  user.password = newPassword;
  user.resetPassToken = null;

  await user.save();

  return;
};

export const refreshAccessTokenService = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(400, 'Unauthorized request.');
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
  } catch (error) {
    if (error?.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Refresh token expired.');
    }

    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid Token.');
    }
  }

  const user = await User.findById(decodedToken?._id).select(
    '-password -refreshToken -otp -otpCreatedAt -resetPassToken',
  );

  if (!user) {
    throw new ApiError(401, 'Invalid Refresh Token.');
  }

  const accessToken = user.generateAccessToken();

  return {
    status: 200,
    accessToken,
    user,
  };
};

export const avatarService = async (avatarFile, userId) => {
  if (!avatarFile) {
    throw new ApiError(400, 'No file uploaded.');
  }

  const user = await User.findById(userId);

  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileExt = path.extname(avatarFile.name);
  const fileName = `avatar-${Date.now()}${fileExt}`;

  const uploadPath = path.join(uploadDir, fileName);

  // Move file (express-fileupload)
  await avatarFile.mv(uploadPath);
  const fileUrl = `http://localhost:9999/uploads/${fileName}`;

  user.avatar = fileUrl;
  await user.save();
  return {
    avatarUrl: fileUrl,
  };
};
