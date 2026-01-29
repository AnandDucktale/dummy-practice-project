import logger from '../logger.js';

const verifyRole = async (req, res, next) => {
  try {
    const admin = req.user;
    if (!(admin.role === 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized person for this end-point',
      });
    }
  } catch (error) {
    logger.error(error, 'Error while checking roles in authorization: ');
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
  next();
};

export default verifyRole;
