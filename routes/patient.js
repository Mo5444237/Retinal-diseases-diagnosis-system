const express = require("express");
const {
  makeAppointmentValidation,
  editAppointmentValidation,
} = require("../validation/patient");
const {
  makeAppointment,
  getAppointments,
  getAppointmentDetails,
  editAppointment,
  cancelAppointment,
} = require("../controllers/patient");
const isAuth = require("../middlewares/is-auth");
const isPatient = require("../middlewares/is-patient");
const router = express.Router();

router.use(isAuth, isPatient);

router.post("/make-appointment", makeAppointmentValidation, makeAppointment);
router.get("/appointments", getAppointments);
router.get("/appointments/:appointmentId", getAppointmentDetails);
router.put(
  "/appointments/:appointmentId",
  editAppointmentValidation,
  editAppointment
);
router.delete("/appointments/:appointmentId", cancelAppointment);

module.exports = router;
