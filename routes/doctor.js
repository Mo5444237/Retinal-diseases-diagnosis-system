const express = require("express");
const isAuth = require("../middlewares/is-auth");
const isDoctor = require("../middlewares/is-doctor");
const {
  getAppointments,
  getAppointmentDetails,
  getSchedule,
  postSchedule,
  writePrescription,
  uploadAppointmentAttachments,
  editProfile,
  getDoctorData,
  getProfile,
} = require("../controllers/doctor");
const {
  postScheduleValidation,
  writePrescriptionValidation,
  editProfileValidation,
} = require("../validation/doctor");
const { uploadMultibleImages, uploadSingleImage } = require("../middlewares/upload-images");
const router = express.Router();

router.get('/details/:doctorId', getDoctorData);

// Protected routes
router.use(isAuth, isDoctor);

router.get('/profile', getProfile);
router.put('/profile', editProfileValidation, uploadSingleImage('doctors', 'profileImg'), editProfile);
router.get("/appointments", getAppointments);
router.get("/appointments/:appointmentId", getAppointmentDetails);
router.get("/schedule", getSchedule);
router.post("/schedule", postScheduleValidation, postSchedule);
router.post("/prescription", writePrescriptionValidation, writePrescription);
router.post("/upload-attachment", uploadMultibleImages("appointments", "images"), uploadAppointmentAttachments);

module.exports = router;
