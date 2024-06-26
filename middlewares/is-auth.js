const jwt = require("jsonwebtoken");

// validate the user token
module.exports = (req, res, next) => {
  const authHeader = req.get("authorization" || "Authorization");
  if (!authHeader) {
    const error = new Error("Invalid token");
    error.statusCode = 401;
    return next(error);
  }
  // "Authorization": 'Bearer ' + token
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    throw error;
  }

  if (!decodedToken) {
    const error = new Error("Invalid token");
    error.statusCode = 401;
    return next(error);
  }

  // keep user id in the req
  req.userId = decodedToken.userId;
  next();
};
