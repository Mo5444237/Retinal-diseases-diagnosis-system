const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");
const Doctor = require("./doctor");

const Schedule = sequelize.define(
  "schedule",
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
    day: {
      type: DataTypes.STRING,
      allowNull: false,
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
  { timestamps: false }
);

// Schedule.sync({force: true})

module.exports = Schedule;
