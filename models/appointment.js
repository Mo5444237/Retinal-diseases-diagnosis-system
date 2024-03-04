const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");
const Attachment = require("./attachment");
const Doctor = require("./doctor");
const Patient = require("./patient");

const Appointment = sequelize.define(
  "appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    doctorId: {
      type: DataTypes.INTEGER,
      references: {
        model: Doctor,
        key: "id",
      },
    },
    patientId: {
      type: DataTypes.INTEGER,
      references: {
        model: Patient,
        key: "id",
      },
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    prescription: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);



module.exports = Appointment;
