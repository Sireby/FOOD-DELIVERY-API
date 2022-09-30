exports.auth = async (req, res, next) => {
  if (
    !req.headers.authorization &&
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.status(403).json({
      message: "Not logged In",
    });
  }
  let token = req.headers.authorization.split(" ")[1];
  const userJWTData = await jwt.verify(token, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  const user = await User.findById(userJWTData.id);

  req.user = user;
  next();
};

exports.checkUser = (...roles) => {
  return async (req, res, next) => {
    if (!req.user.role.includes(...roles)) {
      return res.status(401).json({
        message: "You are not authorized to do this",
      });
    }
    next();
  };
};
