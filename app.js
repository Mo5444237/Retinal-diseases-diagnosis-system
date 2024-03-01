require("dotenv").config();

const express = require("express");
const app = express(); 

const sequelize = require("./util/db");
const Account = require("./models/account");
const Contact = require("./models/contact");
const Admin = require("./models/admin");
const Patient = require("./models/patient");
const Doctor = require("./models/doctor");
const Schedule = require("./models/doctor-schedule");
const Subscription = require("./models/doctor-subscription");
const Appointment = require("./models/appointment");
const Attachment = require("./models/attachment");

Account.hasMany(Contact);
Contact.belongsTo(Account);

Doctor.belongsTo(Account);
Patient.belongsTo(Account);
Admin.belongsTo(Account);

Doctor.hasMany(Schedule);
Schedule.belongsTo(Doctor);

Doctor.hasMany(Subscription);
Subscription.belongsTo(Doctor);

Appointment.hasMany(Attachment);
Attachment.belongsTo(Appointment);

Doctor.belongsToMany(Patient, { through: "appointment" });
Patient.belongsToMany(Doctor, { through: "appointment" });


sequelize
  // .sync({force: true})
  .sync()
  .then(() => console.log("Database Connected!"))
  .then(() => {
    app.listen(process.env.SERVER_PORT, () => {
      console.log("Server is running on port: " + process.env.SERVER_PORT);
    });
  })
  .catch((err) => console.log(err));
