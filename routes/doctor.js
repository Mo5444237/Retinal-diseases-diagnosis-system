const express = require("express");
const isAuth = require("../middlewares/is-auth");
const isDoctor = require("../middlewares/is-doctor");
const {
  getAppointments,
  getAppointmentDetails,
  getSchedule,
  postSchedule,
  writePrescription,
} = require("../controllers/doctor");
const router = express.Router();

router.use(isAuth, isDoctor);

router.get("/appointments", getAppointments);
router.get("/appointments/:appointmentId", getAppointmentDetails);
router.get("/schedule", getSchedule);
router.post("/schedule", postSchedule);
router.post("/prescription", writePrescription);

module.exports = router;
