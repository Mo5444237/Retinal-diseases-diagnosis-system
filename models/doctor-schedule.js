const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");
const Doctor = require("./doctor");

const Schedule = sequelize.define(
  "schedule",
  {
    doctorId: {
      type: DataTypes.UUID,
      references: {
        model: Doctor,
        key: "id",
      },
      primaryKey: true,
    },
    day: {
      type: DataTypes.ENUM(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ),
      allowNull: false,
      primaryKey: true,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["doctorId", "day"],
      },
    ],
    timestamps: false,
  }
);

// Schedule.sync({force: true})

module.exports = Schedule;
