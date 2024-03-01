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
      type: DataTypes.DATE,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  { timestamps: false }
);



module.exports = Schedule;
