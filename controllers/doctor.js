const { validationResult } = require("express-validator");
const Schedule = require("../models/doctor-schedule");
const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");
const cloudinary = require("cloudinary").v2;
const cloudinary = require("cloudinary").v2;

exports.getDoctorData = async (req, res, next) => {
  const doctorId = req.params.doctorId;
  try {
    const doctor = await Doctor.findByPk(doctorId, {
      attributes: {
        exclude: ["accountId", "DOB"],
      },
    });

    if (!doctor) {
      const error = new Error("Doctor not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      ...doctor.dataValues,
      profileImg: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${doctor.profileImg}`,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  const doctorId = req.doctorId;
  try {
    const doctor = await Doctor.findByPk(doctorId);
    res.status(200).json({
      ...doctor.dataValues,
      profileImg: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${doctor.profileImg}`,
    });
  } catch (error) {
    next(error);
  }
};

exports.editProfile = async (req, res, next) => {
  const updatedData = req.body;
  const image = req.file;
  const doctorId = req.doctorId;

  try {
    const doctor = await Doctor.findByPk(doctorId);
    const currentImage = doctor.profileImg;

    if (image) {
      doctor.profileImg = image.filename;
    }

    doctor.name = updatedData.name || doctor.name;
    doctor.phone = updatedData.phone || doctor.phone;
    doctor.address = updatedData.address || doctor.address;
    doctor.DOB = updatedData.DOB || doctor.DOB;
    doctor.description = updatedData.description || doctor.description;

    const result = await doctor.save();
    if (result && currentImage) {
      cloudinary.uploader.destroy(currentImage);
    }

    res.status(200).json("Profile updated successfully.");
  } catch (error) {
    next(error);
  }
};

exports.getAppointments = async (req, res, next) => {
  let date = new Date().toISOString();
  const doctorId = req.doctorId;

  //filtering and pagination
  const filters = req.query;
  const page = parseInt(filters.page, 10) || 1;
  const pageSize = parseInt(filters.pageSize, 10) || 10;
  const skip = (page - 1) * pageSize;

  if (filters.date) {
    date = new Date(filters.date);
  }

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

    let appointmentImages = [];
    if (appointment.images.length !== 0) {
      appointmentImages = appointment.images.map(
        (img) =>
          `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${img}`
      );
    }

    res
      .status(200)
      .json({ ...appointment.dataValues, images: appointmentImages });
  } catch (error) {
    next(error);
  }
};

exports.getSchedule = async (req, res, next) => {
  const doctorId = req.doctorId;

  try {
    const schedule = await Schedule.findAll({
      where: {
        doctorId,
      },
      order: [["day", "ASC"]],
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
      where: {
        doctorId,
        day,
      },
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
  const doctorId = req.doctorId;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  try {
    const appointment = await Appointment.findOne({
      where: {
        id: appointmentId,
        doctorId,
      },
    });

    if (!appointment) {
      const error = new Error("Appointment not found");
      error.statusCode = 404;
      throw error;
    }

    appointment.prescription = prescription;
    appointment.status = "done";
    await appointment.save();

    res.status(200).json({ message: "prescription created successfully." });
  } catch (error) {
    next(error);
  }
};

exports.uploadAppointmentAttachments = async (req, res, next) => {
  const { appointmentId } = req.body;
  const doctorId = req.doctorId;
  const imagesData = req.files;

  try {
    const appointment = await Appointment.findOne({
      where: { id: appointmentId, doctorId },
    });

    if (!appointment) {
      const error = new Error("Appointment not found.");
      error.statusCode = 404;
      throw error;
    }

    console.log(appointment.images);
    const images = imagesData.map((file) => {
      return file.filename;
    });

    appointment.images = [...appointment.images, ...images];
    await appointment.save();

    res.status(200).json("images uplaoded successfully.");
  } catch (error) {
    next(error);
  }
};
