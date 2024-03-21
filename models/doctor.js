const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/db");
const Account = require("./account");
// const Appointment = require("./appointment");
// const { getAvailableTime } = require("../util/get-available-time");
// const Schedule = require("./doctor-schedule");

const Doctor = sequelize.define(
  "doctor",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.UUID,
      references: {
        model: Account,
        key: "id",
      },
    },
    profileImg: {
      type: DataTypes.STRING,
      allowNull: true,
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

// Doctor.prototype.getAvailableAppointments = async function (date) {
//   const selectedDate = new Date(date);
//   const currentAppointments = await Appointment.findAll({
//     where: {
//       doctorId: this.id,
//       date: selectedDate,
//     },
//     attributes: ["time"],
//   });

//   const dayNames = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];

//   // Get the day of the week as a number (0 to 6)
//   const dayOfWeek = selectedDate.getDay();

//   // Map the number to the corresponding day name
//   const dayName = dayNames[dayOfWeek];

//   const doctorSchedule = await Schedule.findOne({
//     where: {
//       doctorId: this.id,
//       day: dayName,
//     },
//   });

//   if (!doctorSchedule) {
//     const error = new Error(`Doctor isn\'t available on ${dayName}`);
//     error.statusCode = 422;
//     throw error;
//   }

//   const startHour = doctorSchedule.startTime.split(":")[0];
//   const endHour = doctorSchedule.endTime.split(":")[0];

//   const appointments = getAvailableTime(+startHour, +endHour);

//   currentAppointments.forEach((app) => {
//     if (appointments[app.time.substring(0, 5)]) {
//       delete appointments[app.time.substring(0, 5)];
//     }
//   });

//   return appointments;
// };

module.exports = Doctor;
