require("dotenv").config();

const express = require("express");
const app = express(); 

const sequelize = require("./util/db");



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
