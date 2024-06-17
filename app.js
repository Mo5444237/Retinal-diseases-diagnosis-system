require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const patientRoutes = require("./routes/patient");
const doctorRoutes = require("./routes/doctor");
const adminRoutes = require("./routes/admin");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/auth", authRoutes);
app.use("/patient", patientRoutes);
app.use("/doctor", doctorRoutes);
app.use("/admin", adminRoutes);

app.use((error, req, res, next) => {
  console.log("Error Middleware: \n" + error);
  const status = error.statusCode || 500;
  const message = error.message || "Something went wrong";
  const data = error.data || [];
  res.status(status).json({ message: message, errors: data });
});

const sequelize = require("./util/db");
const Account = require("./models/account");
const Contact = require("./models/contact");
const Admin = require("./models/admin");
const Patient = require("./models/patient");
const Doctor = require("./models/doctor");
const Schedule = require("./models/doctor-schedule");
const Subscription = require("./models/doctor-subscription");
const RefreshToken = require("./models/refresh-token");
const ResetToken = require("./models/reset-token");
const Appointment = require("./models/appointment");

Account.hasMany(Contact, { as: "Contacts", foreignKey: "accountId" });
Contact.belongsTo(Account, { foreignKey: "accountId" });

Doctor.belongsTo(Account, { as: "Account", foreignKey: "accountId" });
Patient.belongsTo(Account, { as: "Account", foreignKey: "accountId" });
Admin.belongsTo(Account, { as: "Account", foreignKey: "accountId" });

Account.hasMany(RefreshToken, { as: "RefreshTokens", foreignKey: "accountId" });
RefreshToken.belongsTo(Account, { foreignKey: "accountId" });

Account.hasMany(ResetToken, { as: "ResetTokens", foreignKey: "accountId" });
ResetToken.belongsTo(Account, { foreignKey: "accountId" });

Doctor.hasMany(Schedule, { as: "Schedules", foreignKey: "doctorId" });
Schedule.belongsTo(Doctor, { foreignKey: "doctorId" });

Doctor.hasMany(Subscription, { as: "Subscriptions", foreignKey: "doctorId" });
Subscription.belongsTo(Doctor, { foreignKey: "doctorId" });

Doctor.belongsToMany(Patient, {
  through: Appointment,
  foreignKey: "doctorId",
  otherKey: "patientId",
});

Patient.belongsToMany(Doctor, {
  through: Appointment,
  foreignKey: "patientId",
  otherKey: "doctorId",
});

Appointment.belongsTo(Doctor, { foreignKey: "doctorId" });
Appointment.belongsTo(Patient, { foreignKey: "patientId" });

sequelize
  // .sync({alter: true})
  .sync()
  .then(() => console.log("Database Connected!"))
  .then(() => {
    app.listen(process.env.SERVER_PORT, () => {
      console.log("Server is running on port: " + process.env.SERVER_PORT);
    });
  })
  .catch((err) => console.log(err));
