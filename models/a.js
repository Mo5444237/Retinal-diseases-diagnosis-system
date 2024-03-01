// const Account = require("./models/account");
// const Doctor = require("./models/doctor");
// const Patient = require("./models/patient");
// const Appointment = require("./models/appointment");
// const Attachment = require("./models/attachment");
// const Contact = require("./models/contact");
// const Schedule = require("./models/doctor-schedule");
// const Subscription = require("./models/doctor-subscription");

// Account.hasMany(Contact);
// Contact.belongsTo(Account);

// Doctor.belongsTo(Account);
// Patient.belongsTo(Account);

// Doctor.hasMany(Schedule);
// Schedule.belongsTo(Doctor);

// Doctor.hasMany(Subscription);
// Subscription.belongsTo(Doctor);

// Appointment.hasMany(Attachment);
// Attachment.belongsTo(Appointment);

// Doctor.belongsToMany(Patient, { through: "appointment" });
// Patient.belongsToMany(Doctor, { through: "appointment" });
