const { validationResult } = require("express-validator");
const Appointment = require("../models/appointment");

exports.makeAppointment = async (req, res, next) => {
  const { patientId } = req.patientId;
  const { doctorId, date, time } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  try {
    const newAppointment = await Appointment.create({
      doctorId,
      patientId,
      date,
      time,
    });

    res
      .status(201)
      .json({
        message: "Appointment created successfully.",
        appointment: newAppointment,
      });
  } catch (error) {
    next(error);
  }
};

exports.getAppointments = async (req, res, next) => {
  const patientId = req.patientId;

  try {
    const appointments = await Appointment.findAll({
      where: { patientId: patientId },
    });

    if (!appointments) {
      const error = new Error("Invalid data.");
      error.statusCode = 422;
      throw error;
    }

    res.status(200).json({ appointments: appointments });
  } catch (error) {
    next(error);
  }
};

exports.getAppointmentDetails = async (req, res, next) => {
  const appointmentId = req.params.appointmentId;
  const patientId = req.patientId;

  try {
    const appointment = await Appointment.findOne({
      where: {
        id: appointmentId,
        patientId: patientId,
      },
    });

    if (!appointment) {
      const error = new Error("No appointment found.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ appointmentDetials: appointment });
  } catch (error) {
    next(error);
  }
};

exports.editAppointment = async (req, res, next) => {
  const appointmentId = req.params.appointmentId;
  const patientId = req.patientId;
  const { date, time } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Updating appointment failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  try {
    const appointment = await Appointment.findOne({
      where: {
        id: appointmentId,
        patientId: patientId,
      },
    });
    await appointment.update({
      date,
      time,
    });

    res.status(200).json("Appointment Updated Successfully.");
  } catch (error) {
    next(error);
  }
};

exports.cancelAppointment = async (req, res, next) => {
  const appointmentId = req.params.appointmentId;
  const patientId = req.patientId;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Canceling appointment failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  try {
    const appointment = await Appointment.destroy({
      where: {
        id: appointmentId,
        patientId: patientId,
      },
    });

    res.status(200).json("Appointment Canceled Successfully.");
  } catch (error) {
    next(error);
  }
};
