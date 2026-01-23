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
    console.error('Error while checking roles in authorization: ', error);
  }
  next();
};

export default verifyRole;
