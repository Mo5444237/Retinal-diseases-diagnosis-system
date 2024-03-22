const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    doctorId: {
      type: DataTypes.UUID,
      references: {
        model: "Doctor",
        key: "id",
      },
    },
    patientId: {
      type: DataTypes.UUID,
      references: {
        model: "Patient",
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
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    } 
  },
  { timestamps: false }
);



module.exports = Appointment;
