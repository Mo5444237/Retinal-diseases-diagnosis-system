const { validationResult } = require("express-validator");
const Schedule = require("../models/doctor-schedule");
const Appointment = require("../models/appointment");

exports.getAppointments = async (req, res, next) => {
  const date = new Date(req.body.date) || new Date().setHours(0, 0, 0, 0);
  const doctorId = req.doctorId;

  //filtering and pagination
  const filters = req.query;
  const page = parseInt(filters.page, 10) || 1;
  const pageSize = parseInt(filters.pageSize, 10) || 10;
  const skip = (page - 1) * pageSize;

  try {
    const appointments = await Appointment.findAndCountAll({
      where: {
        doctorId,
        date,
      },
      limit: pageSize,
      offset: skip,
    });

    res.status(200).json({ appointments });
  } catch (error) {
    next(error);
  }
};

exports.getAppointmentDetails = async (req, res, next) => {
  const id = req.params.appointmentId;
  const doctorId = req.doctorId;

  try {
    const appointment = await Appointment.findOne({
      where: {
        id,
        doctorId,
      },
    });

    if (!appointment) {
      const error = new Error("Appointment not found.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ appointment });
  } catch (error) {
    next(error);
  }
};

exports.getSchedule = async (req, res, next) => {
  const doctorId = req.doctorId;

  try {
    let queryObject = { doctorId: doctorId };

    const { day } = req.body.day;
    if (day) {
      queryObject.day = day;
    }
    const schedule = await Schedule.findAll({
      where: queryObject,
    });

    res.status(200).json({ schedule });
  } catch (error) {
    next(error);
  }
};

exports.postSchedule = async (req, res, next) => {
  const { day, startTime, endTime } = req.body;
  const doctorId = req.doctorId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  try {
    let schedule = await Schedule.findOne({
      doctorId,
      day,
    });

    if (schedule) {
      schedule.startTime = startTime;
      schedule.endTime = endTime;
      await schedule.save();
    } else {
      schedule = await Schedule.create({
        doctorId,
        day,
        startTime,
        endTime,
      });
    }

    res
      .status(201)
      .json({ message: "Schedule updated successfully.", schedule });
  } catch (error) {
    next(error);
  }
};

exports.writePrescription = async (req, res, next) => {
  const { appointmentId, prescription } = req.body;
  try {
    const appointment = await Appointment.findByPk(appointmentId);
    appointment.prescription = prescription;
    await appointment.save();

    res.status(200).json({ message: "prescription created successfully." });
  } catch (error) {
    next(error);
  }
};
