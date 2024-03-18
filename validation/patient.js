const { body, check } = require("express-validator");
const Doctor = require("../models/doctor");
const Appointment = require("../models/appointment");

exports.editProfileValidation = [
  body("name", "Enter a valid name.")
    .optional()
    .trim()
    .matches(
      /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/
    ),
  body("DOB")
    .optional()
    .trim()
    .custom((value, { req }) => {
      const DOB = new Date(value).getFullYear();
      const currentDate = new Date().getFullYear();

      const age = currentDate - DOB;

      if (age < 18 || age > 80) {
        return Promise.reject("The age has to be within 18 to 80 years.");
      }
      return DOB;
    }),
  body("address", "Enter a valid address")
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 }),
  body("phone", "Enter a valid phone number.")
    .optional()
    .trim()
    .matches(/^01[0125][0-9]{8}$/),
];

exports.getAvailableAppointmentsValidation = [
  body("doctorId")
    .trim()
    .custom(async (value, { req }) => {
      const doctor = await Doctor.findByPk(req.body.doctorId);
      if (!doctor) {
        return Promise.reject("Invalid doctor data.");
      }
    }),
  body("date")
    .trim()
    .custom(async (value, { req }) => {
      const currentDate = new Date().setHours(0, 0, 0, 0);
      const date = new Date(req.body.date);

      const differenceInMilliseconds = date - currentDate;
      if (differenceInMilliseconds <= 0) {
        return Promise.reject("Enter a valid date.");
      }
      return;
    }),
];

exports.makeAppointmentValidation = [
  body("doctorId")
    .trim()
    .custom(async (value, { req }) => {
      const doctor = await Doctor.findByPk(value);

      if (!doctor) {
        return Promise.reject("Invalid doctor data.");
      }
      return doctor;
    }),
  body("date")
    .trim()
    .custom(async (value, { req }) => {
      const currentDate = new Date().setHours(0, 0, 0, 0);
      const date = new Date(value);

      const differenceInMilliseconds = Math.abs(date - currentDate);

      const millisecondsInADay = 1000 * 60 * 60 * 24;
      const millisecondsInSevenDays = 7 * 1000 * 60 * 60 * 24;

      if (differenceInMilliseconds <= millisecondsInADay) {
        return Promise.reject("Appointments cannot be booked in the same day.");
      } else if (
        differenceInMilliseconds > millisecondsInSevenDays ||
        date - currentDate <= 0
      ) {
        return Promise.reject("Date should be within a week from now.");
      }

      return;
    }),
  body("time", "Select a valid time.")
    .trim()
    .matches(/([01]?[0-9]|2[0-3]):[0,3][0]/)
    .custom(async (value, { req }) => {
      const doctor = await Doctor.findByPk(req.body.doctorId);
      const availableAppointments = await doctor.getAvailableAppointments(
        req.body.date
      );

      if (!availableAppointments[value]) {
        return Promise.reject("Appointment is not available.");
      }
      return;
    }),
];

exports.editAppointmentValidation = [
  check("appointmentId")
    .trim()
    .custom(async (value, { req }) => {
      const appointment = await Appointment.findByPk(value);

      if (!appointment) {
        return Promise.reject("Appointment cannot be found.");
      }

      if (appointment.patientId !== req.patientId) {
        return Promise.reject("You are't allowed to edit this appointment.");
      }

      return appointment;
    }),
  body("date").custom(async (value, { req }) => {
    const appointment = await Appointment.findByPk(req.params.appointmentId);

    if (!appointment) {
      const error = new Error("No appointment found.");
      error.statusCode = 404;
      return next(error);
    }

    const currentDate = new Date().setHours(0, 0, 0, 0);
    const appointmentDate = new Date(appointment.date);
    const date = new Date(req.body.date);

    const differenceInMilliseconds = Math.abs(date - currentDate);
    const millisecondsInADay = 1000 * 60 * 60 * 24;
    const millisecondsInSevenDays = 7 * 1000 * 60 * 60 * 24;

    if (appointmentDate - currentDate <= millisecondsInADay) {
      return Promise.reject("Date can no longer be edited or deleted.");
    } else if (
      differenceInMilliseconds > millisecondsInSevenDays ||
      date - currentDate <= 0
    ) {
      return Promise.reject("Date should be within a week from now.");
    }
    return;
  }),
  body("time", "Select a valid time.")
    .trim()
    .matches(/([01]?[0-9]|2[0-3]):[0,3][0]/)
    .custom(async (value, { req }) => {
      const doctor = await Doctor.findByPk(req.body.doctorId);
      const availableAppointments = await doctor.getAvailableAppointments(
        req.body.date
      );

      if (!availableAppointments[value]) {
        return Promise.reject("Appointment is not available.");
      }
      return;
    }),
];

exports.cancelAppointmentValidation = [
  check("appointmentId")
    .trim()
    .custom(async (value, { req }) => {
      const appointment = await Appointment.findByPk(value);

      if (!appointment) {
        return Promise.reject("Appointment cannot be found.");
      }

      if (appointment.patientId !== req.patientId) {
        return Promise.reject("You are't allowed to cancel this appointment.");
      }

      const appointmentDate = new Date(appointment.date);
      const currentDate = new Date();

      const differenceInMilliseconds = Math.abs(appointmentDate - currentDate);
      const millisecondsInADay = 1000 * 60 * 60 * 24;

      if (differenceInMilliseconds < millisecondsInADay) {
        return Promise.reject("Appointment can no longer be canceled.");
      }

      return appointment;
    }),
];
