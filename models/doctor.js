const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");
const Account = require("./account");
const Appointment = require("./appointment");
const { getAvailableTime } = require("../util/get-available-time");

const Doctor = sequelize.define(
  "doctor",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.INTEGER,
      references: {
        model: Account,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DOB: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);

Doctor.prototype.getAvailableAppointments = async function (date) {
  const currentAppointments = await Appointment.findAll({
    where: {
      doctorId: this.id,
      date: new Date(date),
    },
    attributes: ["time"],
  });

  // const doctorSchedule = await Schedule.findOne({
  //   where: {
  //     doctorId: this.id,
  //     day: new Date(date).
  //   }
  // });

  // need to implement scheduling
  const startHour = "8:00:00".split(":")[0];
  const endHour = "22:00:00".split(":")[0];

  const appointments = getAvailableTime(+startHour, +endHour);

  currentAppointments.forEach((app) => {
    if (appointments[app.time.substring(0, 5)]) {
      delete appointments[app.time.substring(0, 5)];
    }
  });

  return appointments;
};

module.exports = Doctor;
