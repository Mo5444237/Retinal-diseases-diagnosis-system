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
    body("date").trim().isDate().custom(async (value, { req }) => {
        const currentDate = new Date();
        const date = new Date(value);

        const differenceInMilliseconds = Math.abs(currentDate - date);

        const millisecondsInSevenDays = 7 * 1000 * 60 * 60 * 24;
        
        if (differenceInMilliseconds <= 0) {
            return Promise.reject('Enter a vaild date');
        } else if (differenceInMilliseconds > millisecondsInSevenDays) {
            return Promise.reject('Date should be within a week from now.');
        }

        return;
  }),
  body("time").trim().isTime(),
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
