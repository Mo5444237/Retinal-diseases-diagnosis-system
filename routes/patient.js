const express = require("express");
const {
  makeAppointmentValidation,
  editAppointmentValidation,
  getAvailableAppointmentsValidation,
  cancelAppointmentValidation,
} = require("../validation/patient");
const {
  makeAppointment,
  getAppointments,
  getAppointmentDetails,
  editAppointment,
  cancelAppointment,
  getAvailableAppointments,
} = require("../controllers/patient");
const isAuth = require("../middlewares/is-auth");
const isPatient = require("../middlewares/is-patient");
const router = express.Router();

router.use(isAuth, isPatient);

router.post(
  "/get-available-appointments",
  getAvailableAppointmentsValidation,
  getAvailableAppointments
);
router.post("/make-appointment", makeAppointmentValidation, makeAppointment);
router.get("/appointments", getAppointments);
router.get("/appointments/:appointmentId", getAppointmentDetails);
router.put(
  "/appointments/:appointmentId",
  editAppointmentValidation,
  editAppointment
);
router.delete(
  "/appointments/:appointmentId",
  cancelAppointmentValidation,
  cancelAppointment
);

module.exports = router;
