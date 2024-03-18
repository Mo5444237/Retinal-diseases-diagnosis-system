const Admin = require("../models/admin");

module.exports = async (req, res, next) => {
  const accountId = req.userId;

  try {
    const admin = await Admin.findOne({
      where: {
        accountId: accountId,
      },
    });

    // Make sure the admin own this specific account
    if (!admin) {
      const error = new Error("Un-authorized.");
      error.statusCode = 403;
      throw error;
    }

    req.adminId = admin.id;
    req.adminDegree = admin.degree;
    next();
  } catch (error) {
    next(error);
  }
};
