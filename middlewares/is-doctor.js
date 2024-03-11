const Doctor = require("../models/doctor");

module.exports = async (req, res, next) => {
  const accountId = req.userId;

  try {
    const doctor = await Doctor.findOne({
      where: {
        accountId: accountId,
      },
    });

    // Make sure the doctor own this specific account
    if (!doctor) {
      const error = new Error("Un-authorized.");
      error.statusCode = 403;
      throw error;
    }

    req.doctorId = doctor.id;
    next();
  } catch (error) {
    next(error);
  }
};
