const { body } = require("express-validator");
const Doctor = require("../models/doctor");
const Appointment = require("../models/appointment");

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
    body("date").trim().custom(async (value, { req }) => {
        const currentDate = new Date();
        const date = new Date(value);

        const differenceInMilliseconds = Math.abs(date - currentDate);

        const millisecondsInADay = 1000 * 60 * 60 * 24;
      const millisecondsInSevenDays = 7 * 1000 * 60 * 60 * 24;
        
        if (differenceInMilliseconds <= millisecondsInADay) {
            return Promise.reject('Appointments cannot be booked in the same day.');
        } else if (differenceInMilliseconds > millisecondsInSevenDays) {
            return Promise.reject('Date should be within a week from now.');
        }

        return;
  }),
  body("time").trim(),
];

exports.editAppointmentValidation = [
    body("date").custom(async (value, { req }) => {
        const appointment = await Appointment.findByPk(req.params.appointmentId);

        if (!appointment) {
            const error = new Error('No appointment found.');
            error.statusCode = 404;
            return next(error);
        }

        const currentDate = new Date(appointment.date);
        const newDate = new Date();
        const differenceInMilliseconds = Math.abs(newDate - currentDate);

        const millisecondsInADay = 1000 * 60 * 60 * 24;

        if (differenceInMilliseconds < millisecondsInADay) {
            return Promise.reject('Date can no longer be edited or deleted.');
        }
    })
]

exports.cancelAppointmentValidation = [
  body('appointmentId')
    .trim()
    .custom(async (value, { req }) => { 
      const appointment = await Appointment.findByPk(value);

      if (!appointment) {
        return Promise.reject('Appointment cannot be found');
      }

      if (appointment.patientId !== req.patientId) {
        return Promise.reject('You cannot cancel this appointment');
      }

      const appointmentDate = new Date(appointment.date);
      const currentDate = new Date();

      const differenceInMilliseconds = Math.abs(appointmentDate - currentDate);
      const millisecondsInADay = 1000 * 60 * 60 * 24;
      
      if (differenceInMilliseconds < millisecondsInADay) {
        return Promise.reject('Appointment can no longer be canceled.');
      }

      return appointment;
    }),
]
