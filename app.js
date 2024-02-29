require("dotenv").config();
const express = require("express");
const sequelize = require("./util/db");

const app = express();

sequelize
  .sync()
  .then(() => app.listen(process.env.SERVER_PORT))
  .then(() =>
    console.log("Server is running on port: " + process.env.SERVER_PORT)
  )
  .catch((err) => console.log(err));
