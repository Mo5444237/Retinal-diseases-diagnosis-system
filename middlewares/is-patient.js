const Patient = require("../models/patient");

module.exports = async (req, res, next) => {
    const accountId = req.userId;
    console.log(accountId)

    try {
        const patient = await Patient.findOne({
            where: {
                accountId: accountId
            }
        });

        // Make sure the patient own this specific account
        if (!patient) {
            const error = new Error('Un-authorized.');
            error.statusCode = 403;
            throw error;
        }

        req.patientId = patient.id;
        next();
    } catch (error) {
        next(error);
    }
};
